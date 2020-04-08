const SERVER='https://apiesamweb.esamcca.com/graphql';
document.addEventListener('DOMContentLoaded', function() {
	 app=new Vue({
	    	el:'#app',
	    	data:{
	    		sedes:[{nombre:'',direccion:'',telefono_fijo:'',telefono1:'',telefono2:''}],
	    		s:0,
	    		programas:[],
	    		programas_menu:[],
	    		areas:[],
	    		categorias:[],
	    		galeria:[{foto:'e1.jpg',descripcion:'Diplomado en emergencias médicas'},
	    				{foto:'e2.jpg',descripcion:'Maestría en recursos humanos'},
	    				{foto:'e4.jpg',descripcion:'Diplomado en ciencias forenses'},
	    				{foto:'e5.jpg',descripcion:''},
	    				{foto:'e6.jpg',descripcion:''},
	    				{foto:'e7.jpg',descripcion:''},
	    				{foto:'e9.jpg',descripcion:'Maestria en instrumentación Quirúrgica'},
	    				{foto:'e10.jpg',descripcion:'Maestría en Derecho Notarial'},
	    				{foto:'e11.jpg',descripcion:'Maestría en Derecho Procesal Penal'},
	    				{foto:'e12.jpg',descripcion:'Maestría en Ingeniería Vial'}]
	    	},
	    	methods:{
	    		getsedes: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{sedes(estado:true){id,nombre,direccion,telefono_fijo,telefono1,telefono2,latitud,longitud}}`
	    			}).then((res)=>{
	    				lista = res.data.data.sedes;
	    				this.sedes = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    	    		this.getprogramasmenu();
	    	    		this.initMaps();
	    			});
	    		},
	    		getultimosprogramas: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{programas(latest:true,por_fecha:true){id,version,grupo,fecha_inicio,arte,portada,
	    						postgrado{nombre,categoria{nombre}},sede{nombre},universidad{nombre}}}`
	    			}).then((res)=>{
	    				lista = res.data.data.programas;
	    				lista.pop();
	    				this.programas = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(function () {
	    				//global.commit('cargar',false);
	    			});
	    		},
	    		getprogramasmenu:function(){
	    			axios.post(SERVER, {
	    				query:`query{
								  programas(por_fecha:false,idsede:`+this.sedes[this.s].id+`){
								    id,postgrado{nombre,categoria{nombre}},version,grupo}
								}`
	    			}).then((res)=> {
	    				datos=res.data.data.programas;
	    				this.programas_menu=datos;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    				//global.commit('cargar',false);
	    				this.activo=true;
	    			});
	    		},
	    		getareas: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{areas{id,nombre}}`
	    			}).then((res)=>{
	    				lista = res.data.data.areas;
	    				this.areas = lista;
	    				this.idarea=lista[0].id;
	    				this.cargar();
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(function () {
	    				//global.commit('cargar',false);
	    			});
	    		},
	    		getcategorias: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{categorias{id,nombre}}`
	    			}).then((res)=>{
	    				lista = res.data.data.categorias;
	    				lista.pop();
	    				this.categorias = lista;
	    				this.idcategoria=lista[0].id;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    				this.getareas();
	    				//global.commit('cargar',false);
	    			});
	    		},
	    		initMaps:function(){
	    				map=new google.maps.Map(document.getElementById('map'), {
	        		        center: {lat: this.sedes[this.s].latitud, lng: this.sedes[this.s].longitud},
	        		        zoom: 16
		        		});
		    		    var marker = new google.maps.Marker({
		    		          position: {lat: this.sedes[this.s].latitud, lng: this.sedes[this.s].longitud},
		    		          map: map,
		    		          title: 'ESAM'
		    		    });
	    		},
	    		format:function(date){
	    			return moment(parseInt(date)).format('DD/MM/YYYY');
	    		}
	    	},
	    	mounted(){
	    		ready();
	    		this.getsedes();
	    		this.getultimosprogramas();
	    		this.getareas();
	    		this.getcategorias();
	    		$('.gallery a').simpleLightbox({});
	    	}
	    });
	  });
  
