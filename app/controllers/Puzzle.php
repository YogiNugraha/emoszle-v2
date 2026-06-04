<?php
class Puzzle extends Controller {
    public function index($game = '') {
        $data['title'] = 'Puzzle';
        $data['game'] = $game;
        $this->view('puzzle/index', $data);
    }
}
