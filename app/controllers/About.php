<?php
class About extends Controller {
    public function index() {
        $data['title'] = 'Tentang Kami';
        $data['css'] = ['about.css'];
        
        $this->view('templates/header', $data);
        $this->view('about/index', $data);
        $this->view('templates/footer', $data);
    }
}
