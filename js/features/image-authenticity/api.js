/* Local-only image model contract. No image data leaves this local application. */
(function () {
  const MAX_BYTES = 50 * 1024 * 1024;
  async function localFetch(url, options) {
    try { return await fetch(url, options); }
    catch (error) {
      if (error.name === "AbortError") throw error;
      throw new Error("公开演示版未连接本地图片模型；请在本地启动完整版后重试。");
    }
  }
  async function jsonResponse(response) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = body.detail;
      const message = detail && detail.message ? detail.message : "公开演示版未连接本地图片模型；请在本地启动完整版后重试。";
      const error = new Error(message);
      error.code = detail && detail.code;
      throw error;
    }
    return body;
  }
  window.ImageAuthenticityAPI = {
    maxBytes: MAX_BYTES,
    validate(file) {
      if (!file || !file.size) return "请选择一张非空图片。";
      if (file.size > MAX_BYTES) return "图片不能超过 50 MB，请压缩后重试。";
      if (!/\.(jpe?g|png|webp)$/i.test(file.name)) return "仅支持 JPG、PNG 和 WebP 图片。";
      return "";
    },
    async health(signal) {
      return jsonResponse(await localFetch("/api/image-authenticity/health", {signal, cache: "no-store"}));
    },
    async sample(src, signal) {
      const response = await localFetch(src, {signal});
      if (!response.ok) throw new Error("示例图片加载失败，请上传自己的图片。");
      return new File([await response.blob()], src.split("/").pop(), {type: "image/png"});
    },
    async detect(file, signal) {
      const body = new FormData();
      body.append("file", file);
      return jsonResponse(await localFetch("/api/image-authenticity/detect", {method: "POST", body, signal}));
    },
  };
})();
