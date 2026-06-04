<?php
class Home extends Controller {
    public function index() {
        $data['title'] = 'Home';
        $data['css'] = ['home.css'];
        $data['js'] = ['home.js'];
        // Base URL will be accessible via BASEURL constant which is better.
        // We'll pass it anyway if needed or the views can just use BASEURL
        $this->view('templates/header', $data);
        $this->view('home/index', $data);
        $this->view('templates/footer', $data);
    }
}
