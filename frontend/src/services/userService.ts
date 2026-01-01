export const userService = {
  async uploadImage(file: File, tileId: string) {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const user = import.meta.env.VITE_GITHUB_USER;

    if (!token || !repo || !user) {
      throw new Error("GitHub env variables are missing");
    }

    const base64 = await fileToBase64(file);

    const path = `public/uploads/${tileId}.jpg`;

    const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

    const body = {
      message: `Upload tile ${tileId}`,
      content: base64,
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub upload failed: ${text}`);
    }

    const json = await res.json();
    return json.content.download_url;
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string).split(",")[1];
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
