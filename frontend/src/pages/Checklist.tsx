// src/pages/Checklist.tsx

import { useState, useEffect } from "react";
import api from "../api";
import Note, { NoteProps } from "../components/Note";
import Header from "../components/Header";

function Checklist() {
  const [notes, setNotes] = useState<NoteProps[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) console.log("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e: React.SyntheticEvent) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) console.log("Note created!");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <div className="notes-section mb-8">
          <h2 className="text-gray-800 text-2xl">Notes</h2>
          {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id} />
          ))}
        </div>
        <h2 className="text-gray-800 text-2xl mb-5">Create a Note</h2>
        <form onSubmit={createNote} className="bg-white p-5 rounded-lg shadow max-w-md mx-auto">
          <label htmlFor="title" className="font-bold mt-2">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full p-2 my-2 border border-gray-300 rounded"
          />
          <label htmlFor="content" className="font-bold mt-2">Content:</label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 my-2 border border-gray-300 rounded"
          ></textarea>
          <br />
          <input type="submit" value="Submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-700" />
        </form>
      </div>
    </div>
  );
}

export default Checklist;