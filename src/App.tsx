import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

interface configInterface {
    ProjDir: string;
    imageCollections: { image: string }[];
}

function App() {
    const [fileStructures, setFileStructure] = useState();

    const defaultconf= `       
    {
        "ProjDir":"test",
        "imageCollections":[
            {
                "image":""
            }
        ]
    }
`

async function saveConfig(content:string) {
    invoke('saveBlankFile', {filename:"lol", content:content});
}

    useEffect(() => {
        // console.log(fileStructures);
    }, [fileStructures]);
    async function readFile() {
        try {
            const filecontent = await invoke('readJsonFile', {filePath:'D:/lol.txt'});
            setFileStructure(JSON.parse(filecontent as string));
            console.log(fileStructures)
        } catch (error) {
            saveConfig(defaultconf)
            console.error("error", error);
        }
    }

    if(!fileStructures){
        readFile()
    }
      
    const UploadImage = () => {
        const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
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
                    if(fileStructures){
                        const configStructure: configInterface = fileStructures;
                        configStructure.imageCollections.push(structure)
                        saveConfig(JSON.stringify(configStructure))
                        console.log("image", configStructure.imageCollections)
                    }
                };
            }
        };

        const renderImage = () => {
            if(fileStructures){
                const configStructure: configInterface = fileStructures;
                saveConfig(JSON.stringify(configStructure))
                return(
                    <div>{configStructure.imageCollections.map((items, index)=><img key={index} src={items.image}/>)}</div>
                )
            }
        };

        return (
            <div>
                <input type="file" accept="image/*" multiple onChange={handleFileInput} />
                <button onClick={handleUpload}>Upload</button>
                <p/>
                <div className="rendered-image">{renderImage()}</div>
            </div>
        );
    };

  return (
    <div className="container">
      <div className="row">
          {/* <button onClick={saveConfig} type="submit">Create Config</button> */}
          <p/>
          <button onClick={readFile} type="submit">Log file content</button>
          <p/>
          <UploadImage/>
      </div>
    </div>
  );
}

export default App;
