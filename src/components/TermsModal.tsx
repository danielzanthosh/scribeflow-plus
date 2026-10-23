import React, { useState } from 'react';
import { ShieldCheck, Lock, Award, FileText, Check, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  isMandatoryGate: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  isMandatoryGate,
  onAccept,
  onClose,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'license' | 'credits'>('terms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-theme-surface border border-theme-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border bg-theme-surfaceHover/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-theme-accentBg text-theme-accent border border-theme-border">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-theme-text tracking-tight">
                ScribeFlow+ Legal & Trust Center
              </h2>
              <p className="text-xs text-theme-textMuted mt-0.5">
                Terms of Service, Zero-Telemetry Privacy Policy & MIT License
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5 border-b border-theme-border/60 pb-px">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'terms'
                  ? 'border-theme-accent text-theme-accent bg-theme-accentBg/30'
                  : 'border-transparent text-theme-textMuted hover:text-theme-text'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'privacy'
                  ? 'border-theme-accent text-theme-accent bg-theme-accentBg/30'
                  : 'border-transparent text-theme-textMuted hover:text-theme-text'
              }`}
            >
              Privacy Policy (Local-First)
            </button>
            <button
              onClick={() => setActiveTab('license')}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'license'
                  ? 'border-theme-accent text-theme-accent bg-theme-accentBg/30'
                  : 'border-transparent text-theme-textMuted hover:text-theme-text'
              }`}
            >
              MIT License & Copyright
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'credits'
                  ? 'border-theme-accent text-theme-accent bg-theme-accentBg/30'
                  : 'border-transparent text-theme-textMuted hover:text-theme-text'
              }`}
            >
              Credits & Attribution
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-theme-text leading-relaxed font-sans">
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-semibold font-serif text-theme-text">1. Acceptance of Terms</h3>
              <p>
                By accessing or using ScribeFlow+, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not accept these terms, you are not authorized to use the application.
              </p>

              <h3 className="text-base font-semibold font-serif text-theme-text">2. Nature of Software & Local Operation</h3>
              <p>
                ScribeFlow+ is a client-side note transcription and cognitive teleprompter application. The software runs locally within your browser sandbox. There are no mandatory user accounts, remote databases, or cloud profile requirements.
              </p>

              <h3 className="text-base font-semibold font-serif text-theme-text">3. Acceptable Use</h3>
              <p>
                You may use ScribeFlow+ for personal, academic, and professional transcription purposes. You agree not to reverse engineer or misrepresent the application’s licensing terms or remove copyright notices provided in accordance with the MIT License.
              </p>

              <h3 className="text-base font-semibold font-serif text-theme-text">4. Disclaimer of Warranties</h3>
              <p className="p-3 rounded-lg bg-theme-surfaceHover border border-theme-border font-mono text-xs text-theme-textMuted">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-theme-accentBg/40 border border-theme-border">
                <Lock className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-theme-text text-sm">100% Client-Side & Local-First Architecture</h4>
                  <p className="text-xs text-theme-textMuted mt-0.5">
                    Your notes, camera frames, and personal data never leave your browser memory.
                  </p>
                </div>
              </div>

              <h3 className="text-base font-semibold font-serif text-theme-text">1. Camera & Video Stream Privacy</h3>
              <p>
                ScribeFlow+ utilizes your webcam solely for client-side head pitch and eye gaze tracking. Video frames are processed strictly in-memory on your local CPU/GPU using the HTML5 Canvas API. Video frames are <strong>never recorded</strong>, <strong>never stored on disk</strong>, and <strong>never transmitted over the internet</strong> to any server or third party.
              </p>

              <h3 className="text-base font-semibold font-serif text-theme-text">2. Zero Telemetry & Zero Analytics</h3>
              <p>
                We do not track your clicks, usage metrics, IP address, reading speed, or clipboard content. There are no tracking pixels, advertising SDKs, or third-party cookies embedded in ScribeFlow+.
              </p>

              <h3 className="text-base font-semibold font-serif text-theme-text">3. Optional BYOK AI Feature</h3>
              <p>
                If you choose to enable the optional AI features by supplying your own API key (e.g. OpenRouter, OpenAI, or local Ollama), queries are transmitted directly from your browser to your configured endpoint. ScribeFlow+ acts as a direct pass-through and stores your API key solely in your browser&apos;s encrypted LocalStorage.
              </p>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-theme-surfaceHover border border-theme-border font-mono text-xs leading-relaxed text-theme-text">
                <p className="font-bold text-sm mb-3">MIT License</p>
                <p className="mb-3">Copyright (c) 2026 Daniel Santhosh and ScribeFlow+ Contributors</p>
                <p className="mb-3">
                  Permission is hereby granted, free of charge, to any person obtaining a copy
                  of this software and associated documentation files (the &quot;Software&quot;), to deal
                  in the Software without restriction, including without limitation the rights
                  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                  copies of the Software, and to permit persons to whom the Software is
                  furnished to do so, subject to the following conditions:
                </p>
                <p className="mb-3">
                  The above copyright notice and this permission notice shall be included in all
                  copies or substantial portions of the Software.
                </p>
                <p>
                  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                  SOFTWARE.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'credits' && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-base font-semibold font-serif text-theme-text">Original Project & Creator Credits</h3>
              <p>
                ScribeFlow+ is built with immense gratitude to the open-source community:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-theme-textMuted">
                <li><strong>Original Creator & Architecture:</strong> Daniel Santhosh (<a href="https://github.com/danielzanthosh" target="_blank" rel="noreferrer" className="text-theme-accent underline">github.com/danielzanthosh</a>)</li>
                <li><strong>KaTeX Mathematical Engine:</strong> Khan Academy & contributors</li>
                <li><strong>Typography:</strong> Crimson Pro by Jacques Le Bailly, Inter by Rasmus Andersson, JetBrains Mono</li>
                <li><strong>Icons:</strong> Lucide Icons (<a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-theme-accent underline">lucide.dev</a>)</li>
                <li><strong>Design & Animation Standards:</strong> Inspired by Emil Kowalski and Impeccable design system</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-theme-border bg-theme-surfaceHover/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          {isMandatoryGate ? (
            <>
              <label className="flex items-center gap-2.5 text-xs text-theme-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-theme-border text-theme-accent focus:ring-theme-accent"
                />
                <span>I have read and agree to the Terms, Privacy Policy, and MIT License</span>
              </label>

              <button
                disabled={!agreed}
                onClick={onAccept}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                  agreed
                    ? 'bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText cursor-pointer active:scale-95'
                    : 'bg-theme-border text-theme-textMuted cursor-not-allowed opacity-60'
                }`}
              >
                <Check className="w-4 h-4" />
                Accept & Enter ScribeFlow+
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-medium bg-theme-surface hover:bg-theme-surfaceHover text-theme-text border border-theme-border transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
