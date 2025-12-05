"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    //
    e.preventDefault();

    if (!file) return;

    // Chunk size
    const chunkSize = 1 * 1024 * 1024; // 1MB
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

    // const rname = Math.random().toString(36).substring(2, 6);
    const chunkUploadPromises: any[] = [];
    chunks.map((chunk, index) => {
      const formData = new FormData();
      formData.set("name", file.name + "-" + index);
      formData.append("large-file", chunk);

      chunkUploadPromises.push(
        fetch("http://localhost:9000/api/upload/large-file", {
          method: "POST",
          body: formData,
        })
      );
    });

    // Merge file
    await Promise.all(chunkUploadPromises);
    await fetch(
      `http://localhost:9000/api/upload/merge-file?file=${file.name}`,
      {
        method: "GET",
      }
    );
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
          accept="*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
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
