import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { PagesModule } from "./modules/pagesModule";

interface configInterface {
  ProjDir: string;
  imageCollections: {image: string }[];
}

function App() {
  const [fileStructures, setFileStructure] = useState<configInterface>();
  const [currentPage, setCurrentPage] = useState(0);

  const confInJson = 
  {
      "ProjDir":"test",
      "imageCollections":[
          {
            "image":""
          }
      ]
  } as configInterface

  async function saveConfig(content: string) {
    invoke("saveBlankFile", { filename: "lol", content: content });
  }

  async function createConfig(){
    if(!fileStructures){
      invoke("saveBlankFile", { filename: "lol", content: "" });
    }  
  }

  useEffect(() => {}, [fileStructures]);
  async function readFile() {
    try {
      const filecontent = await invoke("readJsonFile", {
        filePath: "D:/lol.txt",
      });
      setFileStructure(JSON.parse(filecontent as string));
      console.log(fileStructures);
    } catch (error) {
      saveConfig(JSON.stringify(confInJson));
      console.error("error", error);
    }
  }

  if (!fileStructures) {
    readFile();
  }

  console.log(fileStructures?.imageCollections.length)

  const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
      undefined
    );
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        setSelectedFile(file);
      }
    };

    const handleUpload = () => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const structure = {
            page: 0,
            image: dataUrl,
          };
          if (fileStructures) {
            const configStructure: configInterface = fileStructures;
            configStructure.imageCollections.push(structure);
            saveConfig(JSON.stringify(configStructure));
            console.log("image", configStructure.imageCollections);
          }
        };
      }
    };

    const renderImage = () => {
      if (fileStructures) {
        const configStructure: configInterface = fileStructures;
        saveConfig(JSON.stringify(configStructure));
        return (
          <div>
            {configStructure.imageCollections.map((items, index) => (
              <img key={index} src={items.image} />
            ))}
          </div>
        );
      }
    };

    return (
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
        />
        <button onClick={handleUpload}>Upload</button>
        <p />
        <div className="rendered-image">{renderImage()}</div>
      </div>
    );
  };

  const handleNext = () => {
    if(fileStructures){
      if(currentPage >= fileStructures?.imageCollections.length){
        setCurrentPage(0);
      }else{
        setCurrentPage(currentPage+1)
      }
    }
  };

  const handlePrev = () => {
    if(fileStructures){
      if(currentPage == 0){
        setCurrentPage(fileStructures?.imageCollections.length);
      }else{
        setCurrentPage(currentPage-1)
      }
    }
  };

  console.log("current page", currentPage);

  return (
    <div className="container">
      <div className="pages">
        slides/pagination or something
      </div>
      <div className="row">
        <PagesModule />
        <p/>
        <button onClick={createConfig} type="submit">Create Config</button>
        <p />
        <button onClick={readFile} type="submit">
          Log file content
        </button>
        <p />
        <button onClick={handlePrev}>previous page</button>{" "}
        <button onClick={handleNext}>next page</button>
        <p/>
        {currentPage}
        <p/>
        <UploadImage/>
      </div>
    </div>
  );
}

export default App;
