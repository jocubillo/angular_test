<?php 
	require_once("Rest.inc.php");

	class API extends REST{
		public $data = "";
		
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "power_for_test";
		const DB_PASSWORD = "admin1234";
		const DB = "power_mris_test";

		private $db = NULL;
		private $mysqli = NULL;

		public function __construct(){
			parent::__construct();
			$this->dbConnect();
		}

		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}

		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));

			$method  = $this->get_request_method(); 
			$method_arr = array(
				'GET' => $_GET,
				'REQUEST' => $_REQUEST,
				'POST' => $_POST
			);

			if((int)method_exists($this,$func) > 0)
				$this->$func( $method_arr[$method] );
			else
				$this->response('',404);

		}

		private function users(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT distinct u.id, u.name, u.email FROM users u order by u.id desc";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function user($qrydata){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query = sprintf("SELECT * FROM users where id = %d", $qrydata['id']);
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				// $result = array();
				// while($row = $r->fetch_assoc()){
				// 	$result[] = $row;	
				// }
				// $this->response($this->json($result), 200); // send user details
				$row = $r->fetch_assoc();
				$result = $row;
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function adduser($queryvar){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$name = $queryvar['name'];
			$email = $queryvar['email'];

			$query = sprintf("INSERT INTO users(name,email) VALUES('%s','%s')", $name,$email);
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if( $r ){
				$this->response($this->json($query),200);
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function updateUser($queryvar){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$id = $queryvar['id'];
			$name = $queryvar['name'];
			$email = $queryvar['email'];

			$query = sprintf("UPDATE users set name = '%s', email='%s' where id = %d", $name,$email,$id);
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if( $r ){
				$this->response($this->json($query),200);
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function deleteUser($queryvar){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$id = $queryvar['id'];

			$query = sprintf("DELETE FROM users where id = %d",$id);
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if( $r ){
				$this->response($this->json($query),200);
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}

	}

	$api = new API;
	$api->processApi();
?>