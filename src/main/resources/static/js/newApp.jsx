/*-----global-----*/
const Component = window.React.Component;
const BrowserRouter = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;


/*toastr options*/
toastr.options.positionClass = 'toast-top-left';
toastr.options.progressBar = true;

/*json sorter*/
function predicateBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

/*-----MAIN APP-----*/
	class App extends React.Component {
		render() {
			return (
				<div>
					<Header />
					<Main />
					<Footer />
				</div>
			);
		}
	}
	
	class ModalView extends React.Component {
		constructor(props) {
			super(props);
			this.closeModal = this.closeModal.bind(this);
			
			this.state = {
				show: false,
				imageUrl: "",
				imageStatus: "loading",
				loading: true,
			}
		}
		
		componentWillReceiveProps(newProps) {
			if (this.state.show !== newProps.show) {
				this.setState({show: newProps.show});
			}
			
			if (this.state.imageUrl !== newProps.imageUrl) {
				this.setState({imageUrl: newProps.imageUrl});
			}
		}
		
		closeModal() {
			this.props.close();
			this.setState({loading: true, imageUrl: ""});
		}
		
		handleImageLoaded() {
			this.setState({ loading: false });
		}

		handleImageErrored() {
			this.setState({ loading: false });
		}

		renderSpinner() { // TODO some issue with loading spinner?
			if (!this.state.loading) {
				// Render nothing if not loading 
				return null;
			}
			return (
				<span className="spinner" />
			);
		}
		
		render() {
			return(
				<div className="modalView" style={this.state.show ? {display: 'block'} : {null} } onClick={this.closeModal}>
					<span className="closeBt" onClick={this.closeModal}>&times;</span>
					<img
						className="modalView-content" 
						src={this.state.imageUrl}
						onLoad={this.handleImageLoaded.bind(this)}
						onError={this.handleImageErrored.bind(this)}
					/>
					{this.renderSpinner()}
					<div id="caption">{this.props.caption}</div>
				</div>
			);
		}
	}
	
	class UpdateView extends React.Component {
		constructor(props) {
			super(props);
			this.closeModal = this.closeModal.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleChange = this.handleChange.bind(this);
			
			this.state = {
				show: false,
				image: null,
				
				game: '',
				name: '',
				user: '',
				date: '',
				url: '',
			};
		}

		componentWillReceiveProps(newProps) {
			if (this.state.show !== newProps.show) {
				this.setState({show: newProps.show});
				
			}
			
			if (this.state.image !== newProps.image) {
				this.setState({image: newProps.image});
				if (newProps.image != null) {
					this.setState({
						game: newProps.image.game,
						name: newProps.image.name,
						user: newProps.image.user,
						date: newProps.image.date,
						url: newProps.image.url
					});
				}	
			}
		}
		
		handleChange(e) {
			this.setState(
				{[e.target.name]: e.target.value}
			);
		}
		
		handleSubmit(e) {
			e.preventDefault();
			
			this.state.image.game = this.state.game;
			this.state.image.name = this.state.name;
			this.state.image.user = this.state.user;
			this.state.image.date = this.state.date;
			this.state.image.url = this.state.url;
			
			this.props.updateImage(this.state.image);
			this.props.close();
			this.setState({image: null});
		}
		
		closeModal(e) {
			e.preventDefault();
			this.props.close();
			this.setState({image: null});
		}
		
		render() {
			return(
				<div className="modalView" style={this.state.show ? {display: 'block'} : {null} }>
					<div className="modalForm">
						<h3>Update image information</h3>
						<form>
							<input type="text" placeholder="Game" className="form-control"  name="game" value={this.state.game} onChange={this.handleChange}/>
							<input type="text" placeholder="Name" className="form-control" name="name" value={this.state.name} onChange={this.handleChange}/>
							<input type="text" placeholder="User" className="form-control" name="user" value={this.state.user} onChange={this.handleChange}/>
							<input type="text" placeholder="Date" className="form-control" name="date" value={this.state.date} onChange={this.handleChange}/>
							
							<button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
							<button className="btn btn-info" onClick={this.closeModal}>Close</button>   
						</form>
					</div>
				</div>
			);
		}
	}
	
	class ImageControl extends React.Component {
		constructor(props) {
			super(props);
			this.loadImageForUpdate = this.loadImageForUpdate.bind(this);
			this.updateImage = this.updateImage.bind(this);
			this.deleteImage = this.deleteImage.bind(this);
			this.createImage = this.createImage.bind(this);
			this.closeUpdate = this.closeUpdate.bind(this);
			this.closeView = this.closeView.bind(this);
			this.openView = this.openView.bind(this);
			this.openUpdate = this.openUpdate.bind(this);
			
			this.state = {
				images: [],
				imageUpdate: null,
				showModalView: false,
				showUpdate: false,
				modalImage: "",
				modalCaption: "",
				loading: false,
			};
		}
		
		componentDidMount() {
			this.loadImagesFromServer();
		}
		
		//Modal controls
		closeView() {
			this.setState({ showModalView: false });
		}
		openView(imageUrl, caption) {
			this.setState({ showModalView: true,
							modalImage: imageUrl,
							modalCaption: caption
			});
		}
		//Update modal controls
		openUpdate(image) {
			this.setState({ showUpdate: true,
							imageUpdate: image
			});
		}
		closeUpdate() {
			this.setState({ showUpdate: false });
		}
		
		// Load images from database
		loadImagesFromServer() {
			fetch('http://localhost:8080/api/images', {credentials: 'same-origin'})
			.then((response) => response.json())
			.then((responseData) => {
				this.setState({
					images: responseData._embedded.images,
				});
			});
		}
		
		//loadimage for update
		loadImageForUpdate(image){
			fetch (image._links.self.href,
				{method: 'GET', credentials: 'same-origin'
			}).then((response) => response.json()
			).then((responseData) => {
					this.openUpdate(responseData);
				}
			)
			
		}
		
		//update image
		updateImage(image) {
			fetch(image._links.self.href,
				{
					method: 'PUT',
					credentials: 'same-origin',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(image)
				}
			).then((response) => {
				if (response.ok) {
					toastr.success("OK! ");
					return response;
				} else if (response.status == 401) {
					toastr.error("401 ");
				}
				}, function (e) {
					toastr.warning("Error submitting form! ");
				}
			).then(() => this.loadImagesFromServer());
		}
		
		// Delete image
		deleteImage(image) {
			fetch (image._links.self.href,
				{method: 'DELETE', credentials: 'same-origin'
			}).then(
				res => this.loadImagesFromServer()
			)
		}
	  
		// Create new image
		createImage(data ,image) {	//not optimal
			
			this.setState({loading: true});
			
			fetch("http://localhost:8080/upload", {
				credentials: 'same-origin',
				mode: 'no-cors',
				method: "POST",
				headers: {
				"Accept": "application/json",
				"type": "formData"
				},
				body: data
			}).then((response) => {
				if (response.status == 401) {
					toastr.error("401 ");
					return;
				}else {
					return response;
				}
			}, function (e) {
				toastr.warning("Error submitting form! <br/>" + e);
				return;
			}).then((response) => response.json()
			).then((responseData) => {
					image.user = responseData.user;
					image.date = responseData.date;
					image.url = responseData.url;
					return image;
				}
			).then((image) => {
					fetch('http://localhost:8080/api/images', {
						method: 'POST', credentials: 'same-origin',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(image)
					}).then((response) => {
						if (response.ok) {
							toastr.success("OK! ");
						} else if (response.status == 401) {
							toastr.error("401 ");
						}
					}, function (e) {
						toastr.warning("Error submitting form! <br/>" + e);
					}).then(() => {
						this.loadImagesFromServer();
						this.setState({loading: false});
					})
				}
			)
		}
		
		render() {
			/*show only for user uploads, type=1, !bad way for conditional rendering (use switch, or other alike)*/
			var imageForm;
			if (this.props.type == 1){
				imageForm = <ImageForm createImage={this.createImage}/>
			}
			
			return (
				<div>
					{imageForm}
					<ImageTable
						loadImageForUpdate={this.loadImageForUpdate} 
						deleteImage={this.deleteImage} 
						images={this.state.images}
						closeView={this.closeView}
						openView={this.openView}
						type={this.props.type}
						loading={this.state.loading}
					/>
					<ModalView
						show={this.state.showModalView}
						close={this.closeView}
						imageUrl={this.state.modalImage}
						caption={this.state.modalCaption}
					/>
					<UpdateView
						show={this.state.showUpdate}
						image={this.state.imageUpdate}
						close={this.closeUpdate}
						updateImage={this.updateImage}
					/>
				</div>
			);
		}
	}
	
	class ImageTable extends React.Component {
		constructor(props) {
			super(props);
			
			this.state = {
				loading: false,
			}
		}
		
		componentWillReceiveProps(newProps) {
			if (this.state.loading !== newProps.loading) {
				this.setState({loading: newProps.loading});
			}
		}
		
		render() {
			var updateTh;
			var deleteTh;
			if (this.props.type == 2){
				updateTh = (
					<th></th>
				);
				deleteTh = (
					<th></th>
				);
			}
			
			//Sorting
			this.props.images.sort( predicateBy("date") );
			this.props.images.sort( predicateBy("game") );
			
			var images = this.props.images.map(image =>
				<Image
					key={image._links.self.href} 
					image={image}
					loadImageForUpdate={this.props.loadImageForUpdate} 
					deleteImage={this.props.deleteImage} 
					closeView={this.props.closeView} 
					openView={this.props.openView} 
					type={this.props.type}
				/>
			);
			
			let loader;
			if (this.state.loading) {
				loader = (
					<div className="tableLoading">
						<span className="spinner"></span>
					</div>
				);
			}
			
			return (
			<div className={(this.props.type == 1 ? 'tableDivWithForm' : '')}>
			{loader}
			  <table className="table">
				<thead>
				  <tr>
					<th>Game</th>
					<th>Name</th>
					<th>User</th>
					<th>Date</th>
					{updateTh}
					{deleteTh}
				  </tr>
				</thead>
				<tbody>{images}</tbody>
			  </table>
			</div>
		  );
		}
	}
			
	class Image extends React.Component {
		constructor(props) {
			super(props);
			this.loadImageForUpdate = this.loadImageForUpdate.bind(this);
			this.deleteImage = this.deleteImage.bind(this);
			this.showImage = this.showImage.bind(this);
		}

		loadImageForUpdate(e) {
			e.stopPropagation();
			this.props.loadImageForUpdate(this.props.image);
		} 
		
		deleteImage(e) {
			e.stopPropagation();
			this.props.deleteImage(this.props.image);
		} 
		
		showImage() {
			this.props.openView(this.props.image.url, this.props.image.name);
		}
		
		render() {
			var updateBt;
			var deleteBt;
			
			if (this.props.type == 2){
				updateBt = (
					<td>
						<button className="btn btn-success" onClick={this.loadImageForUpdate}>Update</button>
					</td>
				);
				deleteBt = (
					<td>
						<button className="btn btn-danger" onClick={this.deleteImage}>Delete</button>
					</td>
				);
			}
			
			return (
			  <tr onClick={this.showImage}>
				<td>{this.props.image.game}</td>
				<td>{this.props.image.name}</td>
				<td>{this.props.image.user}</td>
				<td>{this.props.image.date.substring(0,10)}</td>
				{updateBt}
				{deleteBt}
			  </tr>
			);
		} 
	}

	class ImageForm extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				game: '',
				name: '',
				user: '',
				date: '',
				url: '',
				
				file: '',
				imagePreviewUrl: '',
			};
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleChange = this.handleChange.bind(this);
		}
		
		handleImageChange(e) {
			e.preventDefault();

			let reader = new FileReader();
			let file = e.target.files[0];

			reader.onloadend = () => {
				this.setState({
					file: file,
					imagePreviewUrl: reader.result
				});
			}

			reader.readAsDataURL(file)
		}
		
		handleChange(e) {
			this.setState(
				{[e.target.name]: e.target.value}
			);
		}    
		
		handleSubmit(e) {
			e.preventDefault();
			
			if (this.state.file == '' || 
				this.state.game == '' || 
				this.state.name == ''){
				toastr.warning("Check form fields!");
				return;
			}
			
			var data = new FormData();
			data.append("file", this.state.file);
			data.append("name", this.state.file.name);
			
			var newImage = {
				game: this.state.game,	/*user input new as (text) or TODO(dropdown)*/
				name: this.state.name,	/*user input (text)*/
			};
			
			//console.log('handle uploading-', this.state.file);
			this.props.createImage(data, newImage);
		}
		
		render() {
			let {imagePreviewUrl} = this.state;
			let $imagePreview = null;
			if (imagePreviewUrl) {
				$imagePreview = (<img src={imagePreviewUrl} />);
			} else {
				$imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
			}
			
			return (
				<div className="panel panel-default formDiv">
					<span>Upload an image</span>
					<form className="form" ref="form">
							<input type="text" placeholder="Game" className="form-control"  name="game" onChange={this.handleChange}/>
							<input type="text" placeholder="Name" className="form-control" name="name" onChange={this.handleChange}/>
							<br />
							<input className="fileInput" type="file" onChange={(e)=>this.handleImageChange(e)} />
							<br />
							<button className="btn btn-success" onClick={this.handleSubmit}>Upload</button>   
							
							<div className="imgPreview">
								{$imagePreview}
							</div>
					</form>   
				</div>
			);
		}
	}
	
	/*
	class Categories extends React.Component { //TODO & implementation
		render() {
			return (
				<div>
					display all unique game names (clickable), <br/>
					Asks to return all specific images under game's name.
				</div>
			);
		}
	}*/
/*-----COMMON PAGE COMPONENTS-----*/
	/*-----Header-----*/
		class Header extends React.Component {
			render() {
				return (
					<header>
						<a href="#" id="logo"></a>
						<nav>
							<ul id="navControl">
								<li><a href="/signup">signup</a></li>
								<li><a href="/login">login</a></li>
								<li><a href="/logout">logout</a></li>
							</ul>
							<ul id="navMain">
								<li><Link to="/">frontpage</Link></li>
								<li><Link to="/browse">browse</Link></li>
								<li><Link to="/upload">upload(user)</Link></li>
								<li><Link to="/manage">manage(admin)</Link></li>
							</ul>
						</nav>
						<div className="clear"></div>
					</header>
				);
			}
		}

	/*-----Footer-----*/
		class Footer extends React.Component {
			render() {
				return (
					<footer className="clear">
						<p>Kim Brygger (c)</p>
					</footer>
				);
			}
		}

/*-----PAGE CONTENT-----*/
	class Main extends React.Component {
		render() {
			return (
				<main>
					<Switch>
						<Route exact path='/' component={Home}/>
						<Route exact path='/browse' component={Browse}/>
						<Route exact path='/upload' component={Upload}/>
						<Route exact path='/manage' component={Manage}/>
					</Switch>
				</main>
			);
		}
	}
	/*-----Home Page-----*/
		class Home extends React.Component {
			render() {
				return (
					<div>
						<h2>Welcome</h2>
						<p>Demo project, trying out technologies</p>
					</div>
				);
			}
		}

	/*-----Browse Page-----*/
		class Browse extends React.Component {
			render() {
				return (
					<div>
						<h2>Browsing page</h2>
						<p>Open images by clicking on the table rows</p>
						<p>images all users READ ONLY</p>
						<ImageControl type={0} />
					</div>
				);
			}
		}
		
	/*-----Upload page--user---*/
		class Upload extends React.Component {
			render() {
				return (
					<div>
						<h2>Upload</h2>
						<p>Registered USER.level permissions, (adds registered user email instead of name?) <br />Read,Create,<br />user's pictures:(Update, Hide)</p>
						<ImageControl type={1} />
					</div>
				)
			}
		}
	/*-----Manage page--admin---*/
		class Manage extends React.Component {
			render() {
				return (
					<div>
						<h2>Manage</h2>
						<p>Admin.level permissions <br />Read,Update,Delete,(Hide)</p>
						<ImageControl type={2} />
					</div>
				)
			}
		}
	
/*----RENDER----*/
ReactDOM.render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
	), document.getElementById('root')
);
