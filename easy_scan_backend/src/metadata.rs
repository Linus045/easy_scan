use serde::Serialize;


#[derive(Serialize)]
pub struct PDFMetadata {
    pub name: String,
    pub preview_filenames: Vec<String>,
    pub page_count: i32
}

