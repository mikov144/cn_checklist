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
    <div className="min-h-screen bg-synth-background">
      <Header />
      <div className="p-6">
        <div className="notes-section mb-8">
          <h2 className="text-3xl font-retro neon-text text-synth-primary mb-6">
            Notes
          </h2>
          {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id} />
          ))}
        </div>
        <h2 className="text-3xl font-retro neon-text text-synth-primary mb-6">
          Create a Note
        </h2>
        <form onSubmit={createNote} className="bg-synth-background p-6 rounded-lg neon-border max-w-md mx-auto">
          <label htmlFor="title" className="font-bold mt-2 text-synth-secondary neon-text">
            Title:
          </label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full p-2 my-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
          />
          <label htmlFor="content" className="font-bold mt-2 text-synth-secondary neon-text">
            Content:
          </label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 my-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
          ></textarea>
          <br />
          <input
            type="submit"
            value="Submit"
            className="button-retro w-full py-2 px-4 rounded cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}

export default Checklist;