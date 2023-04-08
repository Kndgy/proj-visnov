import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

type ImageData = {
    image: string;
};  

const initialCollections: ImageData[] = []

function App() {
  const [greetMsg, setGreetMsg] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [imgCollection, setImgCollection] = useState<ImageData[]>(initialCollections)

  const UploadImage = () => {
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
            console.log(imgStructures)
            localStorage.setItem('image', JSON.stringify(imgStructures));
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

  async function greet() {
    // invoke('saveBlankFile', {filename:"lol", content:`
    //     [
    //         {
    //             "ProjDir":"test"
    //         }
    //     ]`
    // });
  }

  async function readFile() {
    await invoke('readJsonFile', {filePath:'D:/lol.json'}).then((filecontent)=>{
        console.log(filecontent)
    }).catch((error) => {
        console.error(error);
    });
  }

  return (
    <div className="container">
      <div className="row">
          <button onClick={greet} type="submit">Create Config</button>
          <p/>
          <button onClick={readFile} type="submit">Log file content</button>
          <p/>
          <UploadImage/>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
