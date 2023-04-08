import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file){
        setImage(file);
    }
  };

  const handleUpload = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        localStorage.setItem('image', dataUrl);
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} /> 
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke('saveBlankFile', {filename:"lol", content:`
        [
            {
                "ProjDir":"test"
            }
        ]`
    });
  }

  return (
    <div className="container">
      <div className="row">
          <button type="submit">Create Config</button>
          <br/>
          <br/>
          <UploadImage/>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
