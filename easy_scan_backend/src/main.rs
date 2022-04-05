use actix_cors::Cors;
use actix_files::{Files, NamedFile};
use actix_multipart::{Field, Multipart};
use actix_web::error;
use actix_web::{get, post, web, App, Error, HttpResponse, HttpServer, Responder, Result};
use futures_util::stream::StreamExt as _;
use std::env::set_current_dir;
use std::fs;
use std::fs::create_dir_all;
use std::path::Path;
use std::{env, path::PathBuf};

mod pdf_handler;
mod printer;
mod metadata;

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
        pdf_handler::generate_file(&name, bytes)?;
        pdf_handler::generate_previews(&name);
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

#[get("/metadata/{filename}")]
async fn get_metadata(filepath: web::Path<String>) -> Result<impl Responder, Error> {
    println!("Trying to receive metadata for {}", &filepath);
    pdf_handler::retrieve_metadata(&filepath)
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    create_dir_all("easy_scan_files").expect("Can't create easy_scan_files directory");
    set_current_dir("easy_scan_files").expect("Could not move into easy_scan_files");

    HttpServer::new(|| {
        // TODO: Fix this relative path

        let path: PathBuf = if cfg!(feature = "build_script") {
            "./website/static".parse().unwrap()
        } else {
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
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST"]),
            )
            .service(api_scope)
            .service(echo)
            .service(
                Files::new("/", path)
                    .show_files_listing()
                    .index_file("index.html"),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
