use actix_files::{Files, NamedFile};
use actix_web::{get, post, web, http::header::ContentType, HttpResponse, Error, HttpServer, App, Responder, Result};
use actix_web::error;
use std::{path::PathBuf, env};
use actix_multipart::{Multipart, Field};
use actix_cors::Cors;
use futures_util::stream::StreamExt as _;
use std::fs::File;
use std::fs;
use std::io::prelude::*;
use std::process::Command;
use std::ffi::OsStr;
use std::path::Path;
use std::fs::create_dir_all;
use std::env::set_current_dir;
use serde::Serialize;

mod printer;


#[post("/upload")]
async fn file_upload(mut payload: Multipart) -> Result<HttpResponse, Error> {
    println!("file upload request received for file:");
    create_dir_all("previews").expect("Can't create previews directory");
    create_dir_all("files").expect("Can't create files directory");

    while let Some(item) = payload.next().await {
        let mut field: Field = item?;
        let content_type = field.content_type();
        let name = String::from(field.name());
        let content_disposition = field.content_disposition();
        // println!("\ncontent_type:\n{}\nname:\n{}\ncontent_disposition:\n{}", content_type, name, content_disposition);

        let mut bytes = web::BytesMut::new();
        while let Some(chunk) = field.next().await {
            bytes.extend_from_slice(&chunk?);
        }
        // TODO: name file to better identify it
        // TODO: Store file in some kind of working/data directory (set by some config)
        // TODO: Use Path objects instead of string literals
        let mut file = File::create(format!("files/{}",name))?;
        file.write_all(&bytes)?;

        // pdftoppm -jpeg -r 20 kurzanleitungen_pdfa.pdf test
        // println!("Converting file to preview image: {}", &name);
        let msg = format!("pdftoppm Failed for file: {}", &name);
        let mut output = Command::new("pdftoppm");
        let preview_filename = format!("previews/{}", Path::new(&format!("files/{}",name)).file_stem().unwrap().to_str().unwrap());
        output.args(["-jpeg", "-r", "10", &format!("files/{}", name), &preview_filename]);
        // println!("{:?}",output.get_args().collect::<Vec<&OsStr>>());
        output.spawn().expect(&msg);
    }
    Ok(HttpResponse::Ok().into())
}

#[get("/printers")]
async fn printers() -> Result<impl Responder> {
    let printers = printer::Printer::get_printers();
    Ok(web::Json(printers))
}

#[get("/previews/{pdfname}")]
async fn get_preview_file(path: web::Path<String>) -> Result<NamedFile> {
    println!("Trying to receive file preview for {}", path);
    let image_path = format!("previews/{}", path);
    Ok(NamedFile::open(image_path)?)
}

#[derive(Serialize)]
struct PDFMetadata {
    name: String,
    preview_filenames: Vec<String>,
    page_count: i32,
}

#[get("/metadata/{filename}")]
async fn get_metadata(filepath: web::Path<String>) -> Result<impl Responder, Error> {
    println!("Trying to receive metadata for {}", &filepath);
    let filename = Path::new(&filepath.to_string()).file_stem().unwrap().to_str().unwrap().to_string();
    println!("Trying to match name: {}", filename);
    println!("Filepath to match against {}", filepath);

    let metadata: fs::Metadata = fs::metadata(format!("files/{}", &filepath))?;
    if metadata.is_file() {
        let mut files: Vec<String> = fs::read_dir("previews")?
                .map(|file| String::from(file.unwrap().file_name().to_str().unwrap()))
                .filter(|file| file.starts_with(&format!("{}-",&filename)))
                .collect::<Vec<String>>();
        files.sort();
        let metadata = PDFMetadata {
            name: String::from(&filepath.to_string()),
            preview_filenames: files.clone(),
            page_count: files.len() as i32
            //other stuff
        };
        return Ok(web::Json(metadata))
    }else{
        return Err(error::ErrorNotFound::<&str>("File not found"));
    }
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    create_dir_all("easy_scan_files").expect("Can't create easy_scan_files directory");
    set_current_dir("easy_scan_files").expect("Could not move into easy_scan_files");

    HttpServer::new(|| {
        // TODO: Fix this relative path

        let path: PathBuf = if cfg!(feature = "build_script") {
            "./website/static".parse().unwrap()
        }else {
            "./../easy_scan_website/build".parse().unwrap()
        };
        println!("CWD: {}", env::current_dir().unwrap().to_str().unwrap());
        println!("Path to website is: {}", path.to_str().unwrap());

        let api_scope = web::scope("/api")
            .service(printers)
            .service(file_upload)
            .service(get_preview_file)
            .service(get_metadata);
        App::new()
            .wrap(Cors::default()
                .allow_any_origin()
                .allowed_methods(vec!["GET", "POST"])
            ).service(api_scope)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
            .service(Files::new("/", path).show_files_listing().index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
