import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

type ImageData = {
    image: string;
  };  

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
          const structure = [
            {
                image: dataUrl
            }
            ]
          localStorage.setItem('image', JSON.stringify(structure));
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
        <input type="file" multiple onChange={handleFileInput} />
        <button onClick={handleUpload}>Upload</button>
        <div className="rendered-image">{renderImage()}</div>
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
