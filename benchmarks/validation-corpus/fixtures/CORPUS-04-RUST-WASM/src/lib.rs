use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

mod parser;
mod utils;

#[derive(Serialize, Deserialize)]
pub struct Output {
    pub count: usize,
    pub valid: bool,
}

#[wasm_bindgen]
pub fn process_text(input: &str) -> String {
    let clean = utils::sanitize_input(input);
    let count = parser::count_tokens(&clean);
    format!("tokens:{}", count)
}
