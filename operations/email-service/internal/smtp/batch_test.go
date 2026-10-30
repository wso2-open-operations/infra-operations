// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
package smtpclient

import (
	"bufio"
	"fmt"
	"net"
	"net/smtp"
	"strings"
	"sync"
	"testing"
)

// fakeTransaction records one MAIL..DATA transaction seen by fakeSMTPServer.
type fakeTransaction struct {
	rcpts []string
	data  string
}

// fakeSMTPServer is a minimal plaintext SMTP server. It rejects any
// transaction with more than limit RCPT TO commands with the relay's 554,
// and fails RCPT TO for any address in reject.
type fakeSMTPServer struct {
	mu     sync.Mutex
	txs    []fakeTransaction
	limit  int
	reject map[string]bool
}

func (f *fakeSMTPServer) serve(conn net.Conn) {
	defer conn.Close()
	r := bufio.NewReader(conn)
	say := func(s string) { fmt.Fprintf(conn, "%s\r\n", s) }
	say("220 fake ESMTP")

	var rcpts []string
	for {
		line, err := r.ReadString('\n')
		if err != nil {
			return
		}
		cmd := strings.ToUpper(strings.TrimSpace(line))
		switch {
		case strings.HasPrefix(cmd, "EHLO"), strings.HasPrefix(cmd, "HELO"):
			say("250 fake")
		case strings.HasPrefix(cmd, "MAIL FROM"):
			rcpts = nil
			say("250 ok")
		case strings.HasPrefix(cmd, "RSET"):
			rcpts = nil
			say("250 ok")
		case strings.HasPrefix(cmd, "RCPT TO"):
			addr := strings.Trim(strings.TrimSpace(line[len("RCPT TO:"):]), "<>")
			f.mu.Lock()
			rejected := f.reject[addr]
			f.mu.Unlock()
			if rejected {
				say("550 rejected")
				continue
			}
			if len(rcpts) >= f.limit {
				say(`554 "Transaction failed: Recipient count exceeds 50."`)
				continue
			}
			rcpts = append(rcpts, addr)
			say("250 ok")
		case cmd == "DATA":
			say("354 go")
			var sb strings.Builder
			for {
				l, err := r.ReadString('\n')
				if err != nil {
					return
				}
				if l == ".\r\n" {
					break
				}
				sb.WriteString(l)
			}
			f.mu.Lock()
			f.txs = append(f.txs, fakeTransaction{rcpts: rcpts, data: sb.String()})
			f.mu.Unlock()
			rcpts = nil
			say("250 queued")
		case cmd == "QUIT":
			say("221 bye")
			return
		default:
			say("502 unsupported")
		}
	}
}

// newFakeClient starts a fakeSMTPServer on a pipe and returns a connected
// smtp.Client plus the server.
func newFakeClient(t *testing.T, limit int, reject ...string) (*smtp.Client, *fakeSMTPServer) {
	t.Helper()
	srv := &fakeSMTPServer{limit: limit, reject: map[string]bool{}}
	for _, a := range reject {
		srv.reject[a] = true
	}
	cConn, sConn := net.Pipe()
	go srv.serve(sConn)
	sc, err := smtp.NewClient(cConn, "localhost")
	if err != nil {
		t.Fatalf("smtp.NewClient: %v", err)
	}
	t.Cleanup(func() { _ = sc.Close() })
	return sc, srv
}

func recipients(n int) []string {
	out := make([]string, n)
	for i := range out {
		out[i] = fmt.Sprintf("user%d@example.com", i)
	}
	return out
}

func TestSplitRecipients_BatchesOfFifty(t *testing.T) {
	msg := &Message{To: recipients(120), From: "from@example.com", Subject: "s", HTMLBody: "b"}
	batches := splitRecipients(msg)

	var sizes []int
	delivered := map[string]int{}
	for _, b := range batches {
		sizes = append(sizes, len(b.To)+len(b.CC)+len(b.BCC))
		for _, a := range envelopeAddrs(&b) {
			delivered[a]++
		}
	}
	if fmt.Sprint(sizes) != "[50 50 20]" {
		t.Errorf("batch sizes = %v, want [50 50 20]", sizes)
	}
	for _, r := range msg.To {
		if delivered[r] != 1 {
			t.Errorf("%s in %d batches, want exactly 1", r, delivered[r])
		}
	}
}

func TestSplitRecipients_MixedRolesDedupedAndCounted(t *testing.T) {
	msg := &Message{
		To:  recipients(30),
		CC:  append(recipients(25)[20:], "Dup <USER0@example.com>"), // all already in To
		BCC: []string{"hidden@example.com"},
	}
	batches := splitRecipients(msg)
	if len(batches) != 1 {
		t.Fatalf("batches = %d, want 1", len(batches))
	}
	b := batches[0]
	if len(b.To) != 30 || len(b.CC) != 0 || len(b.BCC) != 1 {
		t.Errorf("roles = To %d CC %d BCC %d, want 30/0/1 (CC entries duplicate To)", len(b.To), len(b.CC), len(b.BCC))
	}
}

func TestSplitRecipients_NoRecipients(t *testing.T) {
	if got := splitRecipients(&Message{From: "f@example.com"}); got != nil {
		t.Errorf("got %d batches, want nil", len(got))
	}
}

func TestSplitRecipients_EachBatchHeaderOnlyListsItsOwn(t *testing.T) {
	msg := &Message{To: recipients(60), BCC: []string{"hidden@example.com"}, From: "from@example.com", Subject: "s", HTMLBody: "<p>b</p>"}
	batches := splitRecipients(msg)
	if len(batches) != 2 {
		t.Fatalf("batches = %d, want 2", len(batches))
	}
	raw0, err := buildMIMEMessage(&batches[0])
	if err != nil {
		t.Fatal(err)
	}
	raw1, err := buildMIMEMessage(&batches[1])
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw0), "user0@example.com") || strings.Contains(string(raw0), "user59@example.com") {
		t.Error("batch 1 header should list user0 but not user59")
	}
	if !strings.Contains(string(raw1), "user59@example.com") || strings.Contains(string(raw1), "user0@example.com") {
		t.Error("batch 2 header should list user59 but not user0")
	}
	if strings.Contains(string(raw0)+string(raw1), "hidden@example.com") {
		t.Error("BCC address must not appear in any header")
	}
}

func TestSendBatch_DeliversWithinLimit(t *testing.T) {
	sc, srv := newFakeClient(t, maxRecipientsPerTransaction)
	raw := []byte("Subject: hi\r\n\r\nbody\r\n")
	if err := sendBatch(sc, "from@example.com", recipients(50), raw); err != nil {
		t.Fatalf("sendBatch: %v", err)
	}
	if len(srv.txs) != 1 || len(srv.txs[0].rcpts) != 50 || srv.txs[0].data != string(raw) {
		t.Errorf("unexpected transactions: %+v", srv.txs)
	}
}

func TestSendBatch_OverLimitIsRejectedByRelay(t *testing.T) {
	sc, _ := newFakeClient(t, maxRecipientsPerTransaction)
	if err := sendBatch(sc, "from@example.com", recipients(51), []byte("x\r\n")); err == nil {
		t.Fatal("expected the relay's 554 for 51 recipients")
	}
}
