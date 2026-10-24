# keras-classifier (project `keras-classifier`)

A Keras image classifier on CPU. Pick a photo on `/` and MobileNetV2 (ImageNet weights) names the top
3 things in it. `POST /classify` takes a form field `image` and answers
`{"predictions":[{"label":"tabby","score":0.81}, ...]}`. `/healthz` answers `ok`.

Keras runs on the JAX backend, so no TensorFlow and no GPU. The build step downloads the weights
into the image, so the app starts without the internet. It asks for `"size": "medium"` (2 CPUs, 2 GiB).

    cd examples/keras-classifier
    sf deploy
