//const SERVER='https://apiesamweb.esamcca.com/graphql';
const SERVER='https://webapi.cybercorp.com.bo/graphql';
document.addEventListener('DOMContentLoaded', function() {
	 app=new Vue({
	    	el:'#app',
	    	data:{
	    		sedes:[{nombre:'',direccion:'',telefono_fijo:'',telefono1:'',telefono2:'',correos:[],redesSociales:[]}],
	    		s:0,
	    		programa:{
	    			id:0,
	    			version:0,
	    			grupo:0,
	    			fecha_inicio: '-',
	    			fecha_fin: '-',
	    			universidad:{nombre:''},
	    			postgrado:{
	    				nombre:'',
	        			objetivo:'',
	        			duracion: 0,
	        			creditaje: '',
	        			dirigido: '',
	        			categoria:{nombre:''}
	    			}
	    		},
	    		programas:[],
	    		programas_sede:[],
	    		areas:[],
	    		categorias:[],
	    		idcategoria: 0,
	    		idarea:0,
	    		nuevos:true,
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
	    				query: `query{sedes(estado:true){id,nombre,direccion,telefono_fijo,telefono1,telefono2,latitud,longitud,correos{nombre,direccion,tipo},redesSociales{nombre,direccion,tipo}}}`
	    			}).then((res)=>{
	    				lista = res.data.data.sedes;
	    				this.sedes = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    	    		this.initMaps();
	    			});
	    		},
	    		getultimosprogramas: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{programas(latest:true,por_fecha:true){id,version,grupo,fecha_inicio,modalidad,portada,
	    						postgrado{nombre,categoria{nombre}},sede{nombre},universidad{nombre}}}`
	    			}).then((res)=>{
	    				lista = res.data.data.programas;
	    				lista.pop();
	    				this.programas = lista;
	    				repararImg();
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(function () {
	    				//global.commit('cargar',false);
	    			});
	    		},
	    		getareas: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{areas{id,nombre}}`
	    			}).then((res)=>{
	    				lista = res.data.data.areas;
	    				this.areas = lista;
	    				this.cargar();
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(function () {
	    				//global.commit('cargar',false);
	    				$('#areas').selectpicker();
	    			});
	    		},
	    		getcategorias: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{categorias{id,nombre}}`
	    			}).then((res)=>{
	    				lista = res.data.data.categorias;
	    				this.categorias = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    				this.getareas();
	    				//global.commit('cargar',false);
	    				$('#categorias').selectpicker();
	    			});
	    		},
	    		cargar:function(){
	    			axios.post(SERVER, {
	    				query:`query{
								  programas(latest:`+this.nuevos+`,por_fecha:true,idsede:`+this.sedes[this.s].id+`,categoria:`+this.idcategoria+`,area:`+this.idarea+`){
								    id,postgrado{nombre,categoria{nombre}},version,grupo,fecha_inicio,modalidad,portada,sede{nombre}
								  }
								}`
	    			}).then((res)=> {
	    				datos=res.data.data.programas;
	    				this.programas_sede=datos;
	    				repararImg();
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    				//global.commit('cargar',false);
	    				this.activo=true;
	    			});
	    		},
	    		getprograma:function(id){
					axios.post(SERVER, {
						query:`query{programa(id:`+id+`){id,postgrado{nombre,duracion,creditaje,dirigido,objetivo,categoria{nombre}},
							   version,grupo,fecha_inicio,fecha_fin,arte,portada,sede{id,nombre,direccion,telefono_fijo,telefono1,telefono2,latitud,longitud},universidad{nombre}}}`
						
					}).then((res)=> {
						datos=res.data.data.programa;
						this.programa=datos;
					}).catch((error)=>{
						//n_error(error);
					}).finally(()=> {
						//global.commit('cargar',false);
						$("#details").modal();
					});
				},
	    		cambiarsede:function(idx){
	    			this.s=idx;
	    			this.idcategoria=0;
	    			this.idarea=0;
	    			this.nuevos=true;
	    			this.cargar();
	    			this.initMaps();
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
	    		open_info:function(){
	    			$('#info').modal();
	    		},
	    		format:function(date){
	    			return moment(parseInt(date)).format('DD/MM/YYYY');
	    		},
	    		formatDate:function(date){
	    			return moment(date).format('DD/MM/YYYY');
	    		},
	    		format_modalidad:function(modalidad){
	    			return modalidad=='V'?'Virtual':modalidad=='S'?'Semi-presencial':'Presencial';
	    		},
	    		repararImg:function(event){
	    			event.target.src ='webdata/portadas/postgrado_default.png';
	    		},
	    		splitsede:function(name){
	    			array=name.split(' ');
	    			array.shift();
	    			return array.join(' ');
	    		},
	    		sendmail:function(){''
	    			resp=$('#form').djValidator({mode:'function'});
	    			if(true){
	    				mensaje="Numero:"+$("#celular").val()+"\n"+
	    					 "Correo:"+$("#correo").val()+"\n"+
	    					 "Consulta:\n"+$("#consulta").val()+"\n";
	    				data={
		    						"sender":{
		    							"name": $("#nombre").val()+" "+$("#apellidos").val(),
		    							 "addr": "informador@esam.edu.bo",
		    							 "password": "informador@esam.edu.bo"
		    						},
		    						"reciever":{
		    						  "name": "Esneyder",
		    						  "addr": "esneyderg357@gmail.com",
		    						  "subject": "Solicitud de Información",
		    						  "msj": mensaje
		    						}
	    				};
	    				/*$.ajax({
	    	                url : 'https://notifier.cybercorp.com.bo/esam/send-notification',
	    	                data : data, 
	    	                method : 'post',
	    	                dataType : 'json',
	    	                success : function(response){
	    	                       alert('ok');
	    	                },
	    	                error: function(error){
	    	                	alert(JSON.stringify(error));
	    	                }
	    				});*/
	    				axios.post("https://notifier.cybercorp.com.bo/esam/send-notification", {
							data//JSON.stringify(data)
						}).then((res)=> {
							alert(res)
						}).catch((error)=>{
							alert(error)
						}).finally(()=> {
							alert("fin")
						});
	    			}
	    		}
	    	},
	    	mounted(){
	    		ready();
	    		this.getsedes();
	    		this.getultimosprogramas();
	    		this.getcategorias();
	    		$('.gallery a').simpleLightbox({});
	    		$('#form').djValidator({mode:'blur'});
	    	}
	    });
	  });
  
