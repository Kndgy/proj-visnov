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

    let file_path = format!("D:/{filename}.json");
    let mut file = match File::create(&file_path) {
        Ok(file) => file,
        Err(err) => return Err(format!("Failed to create file: {}", err)),
    };

    match file.write_all(content.as_bytes()) {
        Ok(_) => Ok(()),
        Err(err) => return Err(format!("Failed to write to file: {}", err)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, two, saveBlankFile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
