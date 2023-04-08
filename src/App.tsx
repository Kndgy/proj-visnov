import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if(file){
        setSelectedFile(file);
      }
    };
  
    const handleUpload = () => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          localStorage.setItem('image', dataUrl);
          setImageUrl(dataUrl);
        };
      }
    };
  
    const renderImage = () => {
      if (imageUrl) {
        return <img src={imageUrl} alt="uploaded image" />;
      }
      const storedImage = localStorage.getItem('image');
      if (storedImage) {
        return <img src={storedImage} alt="previously uploaded image" />;
      }
      return null;
    };
  
    return (
      <div>
        <input type="file" onChange={handleFileInput} />
        <button onClick={handleUpload}>Upload</button>
        {renderImage()}
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
