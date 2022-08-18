use actix_web::{web, error};
use std::fs;
use std::io::prelude::*;
use std::{fs::File, path::Path, process::Command};

use crate::metadata::PDFMetadata;

pub fn generate_file(name: &String, bytes: web::BytesMut) -> std::io::Result<()> {
    // TODO: name file to better identify it
    // TODO: Store file in some kind of working/data directory (set by some config)
    // TODO: Use Path objects instead of string literals
    let mut file = File::create(format!("files/{}", name))?;
    file.write_all(&bytes)?;
    Ok(())
}

pub fn generate_previews(name: &String) {
    // pdftoppm -jpeg -r 20 kurzanleitungen_pdfa.pdf test
    // println!("Converting file to preview image: {}", &name);
    let msg = format!("pdftoppm Failed for file: {}", name);
    let mut output = Command::new("pdftoppm");
    let preview_filename = format!(
        "previews/{}",
        Path::new(&format!("files/{}", name))
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
    );
    output.args([
        "-jpeg",
        "-r",
        "10",
        &format!("files/{}", name),
        &preview_filename,
    ]);
    // println!("{:?}",output.get_args().collect::<Vec<&OsStr>>());
    // TODO: handle error correctly instead of panicing
    output.spawn().expect(&msg);
}

// TODO: accept path object instead of simple string
pub fn retrieve_metadata(filepath : &String) -> Result<web::Json<PDFMetadata>, error::Error> {
    let filename = Path::new(&filepath.to_string())
        .file_stem()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    println!("Trying to match name: {}", filename);
    println!("Filepath to match against {}", filepath);

    let metadata: fs::Metadata = fs::metadata(format!("files/{}", &filepath))?;
    if metadata.is_file() {
        let mut files: Vec<String> = fs::read_dir("previews")?
            .map(|file| String::from(file.unwrap().file_name().to_str().unwrap()))
            .filter(|file| file.starts_with(&format!("{}-", &filename)))
            .collect::<Vec<String>>();
        files.sort();
        let metadata = PDFMetadata {
            name: String::from(&filepath.to_string()),
            preview_filenames: files.clone(),
            page_count: files.len() as i32
        };
        return Ok(web::Json(metadata));
    } else {
        return Err(error::ErrorNotFound::<&str>("File not found"));
    }
}
