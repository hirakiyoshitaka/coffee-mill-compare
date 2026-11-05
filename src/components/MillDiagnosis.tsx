"use client";

import { useState } from "react";
import Link from "next/link";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { affiliateRel } from "@/lib/affiliate";
import {
  buyLinkNote,
  choiceLabel,
  diagnosisModel,
  diagnosisQuestions,
  isCompleteAnswers,
  recommendMill,
  type AnswerKey,
  type Answers,
} from "@/lib/mill-diagnosis";

const emptyAnswers: Partial<Answers> = {};

export function MillDiagnosis() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<Answers>>(emptyAnswers);
  const question = diagnosisQuestions[step];
  const finished = step >= diagnosisQuestions.length && isCompleteAnswers(draft);

  function choose(key: AnswerKey, value: string) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setStep(step + 1);
  }

  function back() {
    if (step === 0) return;
    setStep(step - 1);
  }

  function restart() {
    setDraft(emptyAnswers);
    setStep(0);
  }

  return (
    <div className="diagnosis">
      <noscript>
        <p className="fine">
          質問の切り替えには JavaScript を使います。切っているときは
          <Link href="/articles/how-to-choose-hand-coffee-mill/" className="mx-1 text-link">
            手挽きミルの選び方
          </Link>
          を開いてください。
        </p>
      </noscript>
      {finished ? (
        <DiagnosisResult answers={draft} onRestart={restart} />
      ) : question ? (
        <section aria-labelledby="diagnosis-question">
          <p className="fine">
            {step + 1} / {diagnosisQuestions.length}
          </p>
          <h2 id="diagnosis-question">{question.prompt}</h2>
          <div role="group" aria-labelledby="diagnosis-question" className="choice-list">
            {question.choices.map((choice) => {
              const selected = draft[question.key] === choice.value;
              return (
                <button
                  key={choice.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(question.key, choice.value)}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          {step > 0 ? (
            <p className="hero-actions">
              <button type="button" className="text-link diagnosis-back" onClick={back}>
                前の質問へ戻る
              </button>
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function DiagnosisResult({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const { rule, product } = recommendMill(answers);
  const model = product.buy.kind === "model" ? diagnosisModel(product.buy.modelId) : null;

  return (
    <section className="diagnosis-result" aria-live="polite">
      <p className="fine">この回答からの1台</p>
      <h2>{product.name}</h2>
      <p>{product.summary}</p>
      <ul>
        {product.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
      <p>{rule.reason}</p>
      <h3>選んだ回答</h3>
      <ul>
        {diagnosisQuestions.map((question) => (
          <li key={question.key}>
            {question.prompt}：{choiceLabel(question.key, answers[question.key])}
          </li>
        ))}
      </ul>
      <p className="fine buy-choice">{buyLinkNote(product)}</p>
      {model ? (
        <BuyButtons {...grinderBuyProps(model)} />
      ) : product.buy.kind === "search" ? (
        <>
          <p className="buy-note">購入リンク（広告）</p>
          <a className="buy-link" href={product.buy.href} target="_blank" rel={affiliateRel}>
            Amazonで探す
            <small>広告</small>
            <span className="sr-only">（{product.name}・外部サイト）</span>
          </a>
        </>
      ) : null}
      <p className="hero-actions">
        <Link href={product.articleHref} className="text-link">
          {product.articleLabel}
        </Link>
        <button type="button" className="text-link diagnosis-back" onClick={onRestart}>
          最初からやり直す
        </button>
      </p>
    </section>
  );
}
