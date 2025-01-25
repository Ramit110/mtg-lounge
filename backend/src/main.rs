use axum::{
    extract::{FromRequestParts, Path},
    http::{request::Parts, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Json, RequestPartsExt, Router,
};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize)]
struct Cards {
    message: &'static str,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(hello))
        .route("/site/api/{version}/cards", get(get_cards));

    let app = app.fallback(api_404);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:80").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn hello() -> (StatusCode, Json<Cards>) {
    let response = Cards {
        message: "Hello, world!",
    };

    (StatusCode::OK, Json(response))
}

async fn get_cards() -> (StatusCode, Json<Cards>) {
    let response = Cards {
        message: "Hello, world!",
    };

    (StatusCode::OK, Json(response))
}

async fn api_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Endpoint Does Not Exist")
}

#[derive(Debug)]
enum Version {
    V1,
}

impl<S> FromRequestParts<S> for Version
where
    S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let params: Path<HashMap<String, String>> =
            parts.extract().await.map_err(IntoResponse::into_response)?;

        match version.as_str() {
            "v1" => Ok(Version::V1),
            _ => Err((StatusCode::NOT_FOUND, "unknown version").into_response()),
        }
    }
}
