pub fn count_tokens(input: &str) -> usize {
    input.split_whitespace().count()
}
