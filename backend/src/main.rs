use axum::http::StatusCode;
use axum::{Json, Router};
use axum::routing::get;
use serde::Serialize;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(hello_json));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:80").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn hello() -> (StatusCode, Json<Response>) {
    let response = Response {
        message: "Hello, world!",
    };
    
    (StatusCode::OK, Json(response))
}

#[derive(Serialize)]
struct Response {
    message: &'static str,
}
