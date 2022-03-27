use actix_files::Files;
use actix_web::{get, post, web, HttpResponse, HttpServer, App, Responder, Result};
use std::{path::PathBuf, env};
use actix_cors::Cors;

mod printer;


#[get("/printers")]
async fn printers() -> Result<impl Responder> {
    let printers = printer::Printer::get_printers();
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
        // TODO: Fix this relative path

        let path: PathBuf = if cfg!(feature = "build_script") {
            "./website/static".parse().unwrap()
        }else {
            "./../easy_scan_website/build".parse().unwrap()
        };
        println!("CWD: {}", env::current_dir().unwrap().to_str().unwrap());
        println!("Path to website is: {}", path.to_str().unwrap());

        App::new()
            .wrap(Cors::default()
                .allow_any_origin()
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
