use actix_files::Files;
use actix_web::{get, post, web, HttpResponse, HttpServer, App, Responder, Result};
use std::path::PathBuf;
use actix_cors::Cors;
use serde::Serialize;

mod printer;


#[get("/printers")]
async fn printers() -> Result<impl Responder> {
    let printers = printer::get_printers();
    Ok(web::Json(printers))
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
    HttpServer::new(|| {
        let path: PathBuf = "./easy_scan_website/build".parse().unwrap();
        
        App::new()
            .wrap(Cors::default()
                .allowed_origin("http://localhost:3000")
                .allowed_methods(vec!["GET", "POST"])
            ).service(printers)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
            .service(Files::new("/", path).show_files_listing().index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await   

}
