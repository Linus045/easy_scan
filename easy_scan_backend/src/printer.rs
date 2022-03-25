use std::process::Command;
use uuid::Uuid;
use serde::Serialize;

// See: https://github.com/talesluna/rust-printers


#[derive(Debug,Clone, Serialize)]
pub struct Printer {
    pub id: String,
    name: String,
    pub system_name: String,
}


impl Printer {

    /**
     * Return all printers on system
     */
    pub fn get_printers() -> Vec<Printer> {
        return get_printers();
    }
}

/**
 * Get printers on unix systems using lpstat
 */
pub fn get_printers() -> Vec<Printer> {
    let out = Command::new("lpstat").arg("-e").output().unwrap();
    if out.status.success() {
        unsafe {

            let out_str = String::from_utf8_unchecked(out.stdout);
            let lines: Vec<&str> = out_str.split_inclusive("\n").collect();
            let mut printers: Vec<Printer> = Vec::with_capacity(lines.len());

            for line in lines {
                let system_name = line.replace("\n", "");
                printers.push(Printer {
                    id: Uuid::new_v5(&Uuid::NAMESPACE_DNS, system_name.as_bytes()).to_string(),
                    name: String::from(system_name.replace("_", " ").trim()),
                    system_name: system_name,
                });
            }

            return printers;

        };
    } else {
        return Vec::with_capacity(0);
    }
}

