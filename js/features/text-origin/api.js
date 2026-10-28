/* Real local model transport. Kept separate from the captain's mock data. */
(function () {
  function isResult(value) {
    if (!value || typeof value !== "object" || !["ai", "human"].includes(value.label)) return false;
    const scores = value.scores;
    return !!scores && [scores.ai, scores.human].every((n) => Number.isFinite(n) && n >= 0 && n <= 1)
      && Math.abs(scores.ai + scores.human - 1) < 0.001
      && typeof value.modelVersion === "string"
      && typeof value.truncated === "boolean"
      && [value.inputChars, value.totalTokens, value.tokensUsed, value.maxTokens, value.elapsedMs].every((n) => Number.isFinite(n) && n >= 0);
  }

  async function health(signal) {
    const response = await fetch("/api/text-origin/health", { signal });
    if (!response.ok) throw new Error("公开演示版未连接本地模型服务；请在本地启动完整版后重试。");
    const data = await response.json();
    if (data.service !== "trust-guardian-text-origin") throw new Error("连接到了其他服务");
    return data;
  }

  async function detect(text, signal) {
    let response;
    try {
      response = await fetch("/api/text-origin/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal,
      });
    } catch (error) {
      if (signal.aborted) throw error;
      throw new Error("公开演示版未连接本地模型服务；请在本地启动完整版后重试。", { cause: error });
    }
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body && body.detail && body.detail.message;
      throw new Error(typeof message === "string" ? message : response.status === 422
        ? "请输入 1–5000 字的有效文案。"
        : "公开演示版未连接本地模型服务；请在本地启动完整版后重试。");
    }
    const data = await response.json();
    if (!isResult(data)) throw new Error("模型返回了无效结果，请重试。");
    return data;
  }

  window.TextOriginAPI = { health, detect, isResult };
})();
