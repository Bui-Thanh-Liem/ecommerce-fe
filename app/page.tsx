"use client";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    //
    e.preventDefault();

    //
    const file = files[0];
    if (!file) return;

    // Chunk size
    const chunkSize = file.size / 20; // 3MB
    const chunks = [];
    let startPos = 0;

    //
    while (startPos < file.size) {
      const chunk = file.slice(startPos, startPos + chunkSize);
      chunks.push(chunk);
      startPos += chunkSize;
    }

    //
    if (chunks.length === 0) return;

    //
    chunks.map((chunk, index) => {
      const formData = new FormData();
      formData.set("name-file", file.name + "-" + index);
      formData.append("large-file", chunk);

      fetch("http://localhost:9000/api/upload/large-file", {
        method: "POST",
        body: formData,
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold">Upload nhiều ảnh</h2>

        <input
          type="file"
          name="large-file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded hover:bg-zinc-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
