// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn two(name: &str) -> String {
    // format!("Hello, {}! You've been greeted from Rust lol!", name)
    "Hello from rust!".into()
}

#[tauri::command]
fn saveBlankFile(filename: &str, content: &str) -> Result<(), String> {
    use std::fs::File;
    use std::io::prelude::*;
    use serde_json;

    let file_path = format!("D:/{filename}.txt");
    let mut file = match File::create(&file_path) {
        Ok(file) => file,
        Err(err) => return Err(format!("Failed to create file: {}", err)),
    };

    match file.write_all(content.as_bytes()) {
        Ok(_) => Ok(()),
        Err(err) => return Err(format!("Failed to write to file: {}", err)),
    }
}

#[tauri::command]
fn delete_file(filename: String) -> Result<(), String> {
    let file_path = format!("D:/{}.txt", filename);
    match std::fs::remove_file(file_path) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to delete file: {}", err)),
    }
}

#[tauri::command]
fn readJsonFile(file_path: String) -> Result<String, String> {
    use std::fs;

    let file_content = match fs::read_to_string(&file_path) {
        Ok(content) => content,
        Err(err) => return Err(format!("Failed to read file: {}", err)),
    };

    Ok(file_content)
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, two, saveBlankFile, readJsonFile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
