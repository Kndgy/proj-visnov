import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

type ImageData = {
    image: string;
};  

const initialCollections: ImageData[] = []

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [imgCollection, setImgCollection] = useState<ImageData[]>(initialCollections)
  
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
            const structure = 
            {
                image: dataUrl
            }
            const imgStructures = [...imgCollection, structure]
            setImgCollection(imgStructures)
            localStorage.setItem('image', JSON.stringify(imgStructures));
            setImageUrl(dataUrl);
        };
      }
    };

    const colls = localStorage.getItem('image')
    let parsedImages: ImageData[] = []
    if(colls){
        parsedImages = JSON.parse(colls)
    }
    console.log(parsedImages)

    const renderImage = () => {
      if(colls){
        return(
            <>{parsedImages.map((item)=><img src={item.image}/>)}</>
        )
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
          <button onClick={greet} type="submit">Create Config</button>
          <br/>
          <br/>
          <UploadImage/>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
