﻿
// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyParticle.js
// Created:			12/07/2011
// Author:			Mike
// Project:
// Description:
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 12/07/2011
//
// **********************************************************************************************************************
var PT_SHAPE_PIXEL		=  0,
	PT_SHAPE_DISK		=  1,
	PT_SHAPE_SQUARE		=  2,
	PT_SHAPE_LINE		=  3,
	PT_SHAPE_STAR		=  4,
	PT_SHAPE_CIRCLE		=  5,
	PT_SHAPE_RING		=  6,
	PT_SHAPE_SPHERE		=  7,
	PT_SHAPE_FLARE		=  8,
	PT_SHAPE_SPARK		=  9,
	PT_SHAPE_EXPLOSION	= 10,
	PT_SHAPE_CLOUD		= 11,
	PT_SHAPE_SMOKE		= 12,
	PT_SHAPE_SNOW		= 13,
	PART_SPRITE_NUMB	= 14,

	COLMODE_ONE			= 0,                 // using just one color
	COLMODE_TWO			= 1,                 // interpolate between two colors
	COLMODE_THREE		= 2,                 // interpolate between three colors
	COLMODE_RGB			= 3,                 // use RGB values
	COLMODE_HSV			= 4,                 // use HSV values
	COLMODE_MIX			= 5,                 // mix two colors values

	// Emitter distributions
	PART_EDISTR_LINEAR         = 0,     // linear distribution type
	PART_EDISTR_GAUSSIAN       = 1,     // Gaussian distribution type
	PART_EDISTR_INVGAUSSIAN    = 2,     // Inverse Gaussian distribution type

	// Emitter shapes
	PART_ESHAPE_RECTANGLE      = 0,     // Rectangular shape
	PART_ESHAPE_ELLIPSE        = 1,     // Ellipse shape
	PART_ESHAPE_DIAMOND        = 2,     // Diamond shape
	PART_ESHAPE_LINE           = 3;     // Line shape

var persistentsystemlayernames = [];

// #############################################################################################
/// Class:<summary>
///          	Create a particle type.
///
///				A particle type describes the shape, color, motion, etc. of a particular kind of particles. 
///				You need to define a particle type only once in the game. After this it can be used in any 
///				particle system in the game. Particle types have a large number of parameters that can be 
///				used to change all aspects of it. Setting these right you can create almost any effect you 
///				like. We will discuss the settings below. 
///          </summary>
// #############################################################################################
/**@constructor*/
function yyParticleType()
{
	this.Reset = ParticleType_ClearClass;
	this.Clear = ParticleType_ClearClass;
	this.Reset();
}

// #############################################################################################
/// Function:<summary>
///          	Reset the actual particle type
///          </summary>
// #############################################################################################
/**@constructor*/
function ParticleType_ClearClass()
{
    this.__type = "[ParticleType]";
    this.id = -1;
    this.created = true; 					// whether created
	this.sprite = -1;							// sprite used
	this.spriteanim = true;       				// whether to animate the sprite
	this.spritestretch = false;    				// whether to stretch the animation
	this.spriterandom = false;     				// whether to start at a random position
	this.shape = PT_SHAPE_PIXEL;				// particle shape
	this.sizemin = 1.0;							// minimal size
	this.sizemax = 1.0;							// maximal size
	this.sizeincr = 0.0;						// size increment and 
	this.sizerand = 0.0;						// added randomness
	this.xscale = 1.0;							// additional X scale values
	this.yscale = 1.0;							// additional Y scale values
	this.lifemin = 100;							// minimal and maximal life
	this.lifemax = 100;					
	this.steptype = 0;         					// type of particles to be created each step
	this.stepnumber = 0;       					// number of such particles
	this.deathtype = 0;        					// type of particles to be created when dying
	this.deathnumber = 0;      					// number of such particles
	
	this.spmin = 0.0;							// minimal creation speed 
	this.spmax = 0.0;							// maximal creation speed
	this.spincr =0.0;							// speed increment  
	this.sprand = 0.0;							// added randomness
	this.dirmin = 0.0;							// minimal direction 
	this.dirmax = 0.0;							// maximal direction
	this.dirincr = 0.0;							// direction increment 
	this.dirrand = 0.0;							// added randomness
	this.angmin = 0.0;							// minimum angle 
	this.angmax = 0.0;							// maximum angle
	this.angincr = 0.0;							// angle increment  
	this.angrand = 0.0;							// added randomness
	this.angdir=0.0;							// whether to add the direction to the angle
	this.grav = 0.0;                			// gravity per step
	this.gravdir = 270.0;             			// gravity direction
	this.colmode = COLMODE_ONE; 				// color mechanism used
	this.colpar = [];							// (6) color parameters, depending on mode
    this.colpar[0] = clWhite;
    this.colpar[1] = clWhite;
    this.colpar[2] = clWhite;
		
	this.alphastart = 1.0;						//
	this.alphamiddle = 1.0;						// alpha values
	this.alphaend = 1.0;						//

	this.additiveblend = false;	    			// whether to use additive blending
}


// #############################################################################################
/// Class:<summary>
///           An emitter
///        </summary>
// #############################################################################################
/**@constructor*/
function yyEmitter()
{
	this.Clear = Emitter_Reset;
	this.Reset = Emitter_Reset;

	this.Reset();
}

// #############################################################################################
/// Function:<summary>
///          	Clear/intialise the emitter.
///          </summary>
// #############################################################################################
/**@constructor*/
function Emitter_Reset()
{
	this.created = true;		// whether created

	this.number = 0;			// number of particles per step
	this.parttype = 0;			// type of particles	
	this.xmin = 0.0;			// the region in which to create particles
	this.xmax = 0.0; 
	this.ymin = 0.0; 
	this.ymax = 0.0; 

	this.shape = PART_ESHAPE_RECTANGLE;         // shape of the region
	this.posdistr = PART_EDISTR_LINEAR;			// position distribution type
}


// #############################################################################################
/// Function:<summary>
///          	Create a single particle
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/**@constructor*/
function yyParticle()
{
	this.alive=false;			// whether still alive
	this.parttype=0;			// the particle type
	this.age=0;					// current age
	this.lifetime=0;			// number of steps to live
	this.x=0;					// position
	this.y=0;						
	this.speed=0;				// speed
	this.dir=0;					// direction
	this.ang=0;					// angle
	this.color=0xffffff;		// the current color
	this.alpha=1.0;				// current alpha
	this.size=0;				// the size of the particle
	this.spritestart=0;			// the starting sprite image
	this.ran = 0; 					// random number for different purposes
	this.id = -1;
}



// #############################################################################################
/// Function:<summary>
///          	Create a whole particle system
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/**@constructor*/
function yyParticleSystem()
{
	this.Clear = ParticleSystem_ClearClass;
	this.Reset = ParticleSystem_ClearClass;
	this.Reset();
}

// #############################################################################################
/// Function:<summary>
///          	Clear/Reset paricle system
///          </summary>
// #############################################################################################
/**@constructor*/
function ParticleSystem_ClearClass()
{
	this.created = false;					// whether created
	
	this.particles = [];							// the particles
	this.emitters = []; 						// the emitters
	
	this.oldtonew = true;					// whether drawing from old to new
	this.depth = 0.0;                		// the depth of the particle system
	this.xdraw = 0.0;						// drawing position
	this.ydraw = 0.0;               
	this.automaticupdate = true;       	 	// whether to update automatically
	this.automaticdraw = true;         	 	// whether to draw automatically

	this.m_elementID = -1;                  // layer element ID (Zeus only)
	//this.m_origLayerID = -1;                // original layer ID (Zeus only)
	this.m_volatile = false;                 // whether the system should be destroyed on room exit (Zeus only)
}


// #############################################################################################
/// Function:<summary>
///             Get a random from 0 to 1
///          </summary>
///
/// Out:	 <returns>
///				the random number.
///			 </returns>
// #############################################################################################
function YYRandom(_v) 
{
	var r = rand();
	return r * _v;
}


// #############################################################################################
/// Function:<summary>
///				Generate a random value between the bounds with the indicated distribution
///          </summary>
///
/// In:		 <param name="minval">Min bounds</param>
///			 <param name="maxval">Max bounds</param>
///			 <param name="distr">how the values are distributed between bounds</param>
/// Out:	 <returns>
///				a new random number
///			 </returns>
// #############################################################################################
function	MyRandom(_minval, _maxval, _distr)
{
	var range = _maxval-_minval;
	if ( range <= 0 ) return _minval;

	var xx = 0.0;
	var Result = 0.0;

	switch ( _distr )
	{
		case PART_EDISTR_LINEAR:			Result = _minval + YYRandom(1) * range;
											break;
	
		//Gaussian distribution, SD = 1, cutoff @ +/- 3
		case PART_EDISTR_GAUSSIAN:  
		{
			do { 
				xx = ( YYRandom(1) -0.5 )* 6.0; 
			} 
			while ( (exp(-(xx*xx)*0.5) <= YYRandom(1) ) );		
			Result = _minval + ((xx+3.0) *  (1.0/6.0) ) * range;
		}
		break;


		//Inverse Gaussian distribution, SD = 1, cutoff @ +/- 3
		case PART_EDISTR_INVGAUSSIAN:  
		{
			do { 
				xx = ( YYRandom(1)-0.5 ) * 6.0;
			} while ( ! (exp(-(xx*xx)*0.5) > YYRandom(1)) );

			if ( xx < 0.0 ) xx += 6.0;
			Result = _minval + (xx* (1.0/6.0)) * range;
		}
		break;

		default:
			Result = _minval + YYRandom(1) * range;
	}

  return Result;
}


// #############################################################################################
/// Function:<summary>
///				Computes the direction and speed from a vector
///          </summary>
///
/// In:		 <param name="h"></param>
///			 <param name="v"></param>
///			 <param name="dir"></param>
///			 <param name="sp"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Vector_To_Direction( _h, _v )
{
	var dir;

	// direction
	if ( _h == 0 )
	{
		if ( _v > 0 ) 
		{
			dir = 270; 
		}
		else if ( _v < 0 ) 
		{ 
			dir = 90; 
		}
		else 
		{ 
			dir = 0; 
		}
	}
	else
	{
		var dd = 180.0*(Math.atan2(_v,_h))/Math.PI;
		if ( dd <= 0 ) { dir = -dd; } else { dir = 360.0-dd; }
	}
	return dir - 360.0*Math.floor(dir/360.0);
}

// #############################################################################################
/// Function:<summary>
///				Computes the "H" component from the speed and direction
///          </summary>
///
/// In:		 <param name="dir"></param>
///			 <param name="sp"></param>
///			 <param name="h"></param>
///			 <param name="v"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Direction_To_Vector_h(_dir, _sp )
{
	return _sp * Math.cos(_dir * Math.PI/180.0);
}
// #############################################################################################
/// Function:<summary>
///				Computes the "V" component from the speed and direction
///          </summary>
///
/// In:		<param name="_dir"></param>
///			<param name="_sp"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Direction_To_Vector_v(_dir, _sp )
{
	return -_sp * Math.sin(_dir * Math.PI/180.0);
}


// #############################################################################################
/// Function:<summary>
///				Computes the color for the particle
///          </summary>
///
/// In:		 <param name="part"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Compute_Color(_pParticle)
{
	var pPartType = g_ParticleTypes[_pParticle.parttype];
	{
		if (_pParticle.age <= 0 || _pParticle.lifetime <= 0)
		{
			// Create a new color
			switch( pPartType.colmode )
			{
				case COLMODE_ONE: _pParticle.color = pPartType.colpar[0];
									break;
				case COLMODE_TWO: _pParticle.color = pPartType.colpar[0];
									break;
				case COLMODE_THREE: _pParticle.color = pPartType.colpar[0];
									break;
				case COLMODE_RGB:		{
											var r = ~~(MyRandom( pPartType.colpar[0], pPartType.colpar[1], PART_EDISTR_LINEAR));
											var g = ~~(MyRandom( pPartType.colpar[2], pPartType.colpar[3], PART_EDISTR_LINEAR));
											var b = ~~(MyRandom( pPartType.colpar[4], pPartType.colpar[5], PART_EDISTR_LINEAR));
											_pParticle.color =   (r<<16) + (g<<8) + b;

										}
										break;					
				case COLMODE_HSV:		{
											 var h = ~~(MyRandom( pPartType.colpar[0], pPartType.colpar[1], PART_EDISTR_LINEAR));
											 var s = ~~(MyRandom( pPartType.colpar[2], pPartType.colpar[3], PART_EDISTR_LINEAR));
											 var v = ~~(MyRandom( pPartType.colpar[4], pPartType.colpar[5], PART_EDISTR_LINEAR));
											 //THSV thsv = Color_HSV(h,s,v);
											 _pParticle.color = 0xffffff; //Color_HSVToColor( thsv );
										}
										break;
									case COLMODE_MIX: _pParticle.color = ConvertGMColour( Color_Merge(pPartType.colpar[0], pPartType.colpar[1], YYRandom(1)) );
				                        break;
			}
		}
		else
		{
			// Adapt the color
			switch ( pPartType.colmode )
			{
				case COLMODE_TWO:		{
											var val = _pParticle.age/_pParticle.lifetime;
											if ( val > 1 ) val = 1;
											_pParticle.color =  Color_Merge((pPartType.colpar[0]), (pPartType.colpar[1]), val);
										}
										break;
				case COLMODE_THREE:		{
											var val = 2.0*_pParticle.age/_pParticle.lifetime;
											if (val > 2) val = 2;
											if (val < 1)
											{
												_pParticle.color = Color_Merge(pPartType.colpar[0], pPartType.colpar[1], val);
											}
											else
											{
												_pParticle.color = Color_Merge(pPartType.colpar[1], pPartType.colpar[2], val - 1);
											}
										}
										break;
			}
		}
	}
}


// #############################################################################################
/// Function:<summary>
///				Creates numb particles of the indicated type at the indicated position
///          </summary>
///
/// In:		 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="parttype"></param>
///			 <param name="Result"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function CreateParticle(_x, _y, _parttype )
{
	var Result = new yyParticle;
	
	var pParType = g_ParticleTypes[_parttype];
	if( pParType==null || pParType==undefined ) return null;

	Result.alive = true;
	Result.parttype = _parttype;
	Result.x = _x;
	Result.y = _y;
	Result.speed =		MyRandom( pParType.spmin,  pParType.spmax,  0);
	Result.dir =		MyRandom( pParType.dirmin, pParType.dirmax, 0);
	Result.ang =		MyRandom( pParType.angmin, pParType.angmax, 0);
	Result.lifetime =   MyRandom( pParType.lifemin, pParType.lifemax, 0);
	Result.age = 0;
	Result.color = 0xffffff;	
		
	Compute_Color(Result);
		
	Result.alpha = pParType.alphastart;
	Result.size = MyRandom( pParType.sizemin, pParType.sizemax, 0);
	Result.additiveblend = pParType.additiveblend;
		
	
	if ( pParType.spriterandom )
	{
		Result.spritestart = YYRandom(10000);
	}
	else
	{
		Result.spritestart = 0;
	}
	Result.ran = YYRandom(100000);
	return Result;
}


// #############################################################################################
/// Function:<summary>
///				Creates a new particle type and returns its index
///          </summary>
/// Out:	<returns>
///				The partical type index
///			</returns>
// #############################################################################################
function ParticleType_Create()
{
  // find an available index
  var ind = g_ParticleTypes.length;
  g_ParticleTypes[ind] = new yyParticleType();			// also clears to defaults.

  return ind;
}


// #############################################################################################
/// Function:<summary>
///				Destroys the given particle type
///          </summary>
///
/// In:		<param name="ind">Index to destroy</param>
// #############################################################################################
function ParticleType_Destroy(_ind)
{
    _ind = yyGetInt32(_ind);

	var pPar = g_ParticleTypes[_ind];
	if( pPar == null || pPar==undefined ) return false;
	g_ParticleTypes[_ind] = null;
	return true;
}


// #############################################################################################
/// Function:<summary>
///          	Reset/Clear the partical type
///          </summary>
///
/// In:		<param name="_ind">type to clear</param>
/// Out:	<returns>
///				true for okay, false for error
///			</returns>
// #############################################################################################
function ParticleType_Clear(_ind)
{
    _ind = yyGetInt32(_ind);

	var pPar = g_ParticleTypes[_ind];
	if (pPar == null || pPar == undefined) return false;
	g_ParticleTypes[_ind].Clear();
	return true;
}
// #############################################################################################
/// Function:<summary>
///				Destroys all particle types
///          </summary>
// #############################################################################################
function ParticleType_DestroyAll()
{
	g_ParticleTypes = [];
}


// #############################################################################################
/// Function:<summary>
///				Returns whether the particle type exists
///          </summary>
///
/// In:		<param name="ind">particle index to test</param>
/// Out:	<returns>
///				true for yes, false for no.
///			</returns>
// #############################################################################################
function	ParticleType_Exists(_ind)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return false;

	return true;
}

// #############################################################################################
/// Function:<summary>
///				Sets the shape for the indicated particle type
///          </summary>
///
/// In:		<param name="ind">_particle index to change</param>
///			<param name="shape">Shape to set</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	ParticleType_Shape(_ind, _shape)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.shape = yyGetInt32(_shape);
	pPar.sprite = -1;             // No sprite when we have a shape
}


// #############################################################################################
/// Function:<summary>
///          	Sets the sprite for the indicated particle type
///          </summary>
///
/// In:		<param name="_ind">Particle type ti change</param>
///			<param name="_sprite"></param>
///			<param name="_anim"></param>
///			<param name="_stretch"></param>
///			<param name="_rand"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleType_Sprite(_ind, _sprite, _anim, _stretch, _rand)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.sprite = yyGetInt32(_sprite);
	pPar.spriteanim = yyGetBool(_anim);
	pPar.spritestretch = yyGetBool(_stretch);
	pPar.spriterandom = yyGetBool(_rand);
}

// #############################################################################################
/// Function:<summary>
///				Sets the size for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="sizemin"></param>
///			 <param name="sizemax"></param>
///			 <param name="sizeincr"></param>
///			 <param name="sizerand"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Size(_ind, _sizemin, _sizemax, _sizeincr, _sizerand)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
		
	pPar.sizemin = yyGetReal(_sizemin);
	pPar.sizemax = yyGetReal(_sizemax);
	pPar.sizeincr = yyGetReal(_sizeincr);
	pPar.sizerand = yyGetReal(_sizerand);
}


// #############################################################################################
/// Function:<summary>
///				Sets the scaling for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="xscale"></param>
///			 <param name="yscale"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Scale(_ind, _xscale, _yscale)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
	
	pPar.xscale = yyGetReal(_xscale);
	pPar.yscale = yyGetReal(_yscale);
}

// #############################################################################################
/// Function:<summary>
///				Sets the life time for the indicated particle type
///          </summary>
///
/// In:		<param name="ind"></param>
///			<param name="lifemin"></param>
///			<param name="lifemax"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	ParticleType_Life(_ind, _lifemin, _lifemax)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
	
	pPar.lifemin = yyGetInt32(_lifemin);
	pPar.lifemax = yyGetInt32(_lifemax);
}

// #############################################################################################
/// Function:<summary>
///				Sets the step creation particles for the indicated particle type
///          </summary>
///
/// In:		<param name="ind"></param>
///			<param name="stepnumber"></param>
///			<param name="steptype"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	ParticleType_Step(_ind, _stepnumber, _steptype)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
	
	pPar.stepnumber = yyGetInt32(_stepnumber);
	pPar.steptype = yyGetInt32(_steptype);
}


// #############################################################################################
/// Function:<summary>
///				Sets the death creation particles for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="deathnumber"></param>
///			 <param name="deathtype"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Death(_ind, _deathnumber, _deathtype)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
	
	pPar.deathnumber = yyGetInt32(_deathnumber);
	pPar.deathtype = yyGetInt32(_deathtype);
}

// #############################################################################################
/// Function:<summary>
///				Sets the speed for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="spmin"></param>
///			 <param name="spmax"></param>
///			 <param name="spincr"></param>
///			 <param name="sprand"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Speed(_ind, _spmin, _spmax, _spincr, _sprand)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;
	
	pPar.spmin = yyGetReal(_spmin);
	pPar.spmax = yyGetReal(_spmax);
	pPar.spincr = yyGetReal(_spincr);
	pPar.sprand = yyGetReal(_sprand);
}


// #############################################################################################
/// Function:<summary>
///				Sets the direction for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="dirmin"></param>
///			 <param name="dirmax"></param>
///			 <param name="dirincr"></param>
///			 <param name="dirrand"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Direction(_ind, _dirmin, _dirmax, _dirincr, _dirrand)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.dirmin = yyGetReal(_dirmin);
	pPar.dirmax = yyGetReal(_dirmax);
	pPar.dirincr = yyGetReal(_dirincr);
	pPar.dirrand = yyGetReal(_dirrand);
}


// #############################################################################################
/// Function:<summary>
///				Sets the angle for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="angmin"></param>
///			 <param name="angmax"></param>
///			 <param name="angincr"></param>
///			 <param name="angrand"></param>
///			 <param name="angdir"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleType_Orientation(_ind, _angmin, _angmax, _angincr, _angrand,_angdir)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.angmin = yyGetReal(_angmin);
	pPar.angmax = yyGetReal(_angmax);
	pPar.angincr = yyGetReal(_angincr);
	pPar.angrand = yyGetReal(_angrand);
	pPar.angdir = yyGetBool(_angdir);
}

// #############################################################################################
/// Function:<summary>
///				Sets the gravity for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="grav"></param>
///			 <param name="gravdir"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function  ParticleType_Gravity(_ind, _grav, _gravdir)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.grav = yyGetReal(_grav);
	pPar.gravdir = yyGetReal(_gravdir);
}


// #############################################################################################
/// Function:<summary>
///				Sets an RGB color for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="rmin"></param>
///			 <param name="rmax"></param>
///			 <param name="gmin"></param>
///			 <param name="gmax"></param>
///			 <param name="bmin"></param>
///			 <param name="bmax"></param>
///				
// #############################################################################################
function ParticleType_Colour_RGB(_ind, _rmin, _rmax, _gmin, _gmax, _bmin, _bmax)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.colmode = COLMODE_RGB;
	pPar.colpar[0] = yyGetInt32(_rmin);
	pPar.colpar[1] = yyGetInt32(_rmax);
	pPar.colpar[2] = yyGetInt32(_gmin);
	pPar.colpar[3] = yyGetInt32(_gmax);
	pPar.colpar[4] = yyGetInt32(_bmin);
	pPar.colpar[5] = yyGetInt32(_bmax);
}


// #############################################################################################
/// Function:<summary>
///				Sets the color for the indicated particle to a random mix of the 2 colours
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="col1"></param>
///			 <param name="col2"></param>
///				
// #############################################################################################
function  ParticleType_Colour_Mix( _ind, _col1, _col2 )
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.colmode = COLMODE_MIX;
	pPar.colpar[0] = ConvertGMColour(yyGetInt32(_col1));
	pPar.colpar[1] = ConvertGMColour(yyGetInt32(_col2));
}


// #############################################################################################
/// Function:<summary>
///				Sets an HSV color for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="hmin"></param>
///			 <param name="hmax"></param>
///			 <param name="smin"></param>
///			 <param name="smax"></param>
///			 <param name="vmin"></param>
///			 <param name="vmax"></param>
///				
// #############################################################################################
function	ParticleType_Colour_HSV(_ind, _hmin, _hmax, _smin, _smax, _vmin, _vmax)
{
	var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.colmode = COLMODE_HSV;
	pPar.colpar[0] = yyGetInt32(_hmin);
	pPar.colpar[1] = yyGetInt32(_hmax);
	pPar.colpar[2] = yyGetInt32(_smin);
	pPar.colpar[3] = yyGetInt32(_smax);
	pPar.colpar[4] = yyGetInt32(_vmin);
	pPar.colpar[5] = yyGetInt32(_vmax);
}


// #############################################################################################
/// Function:<summary>
///				Sets the color for the indicated particle type using 1 color
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="colstart"></param>
///				
// #############################################################################################
function ParticleType_Color1(_ind, _colstart)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.colmode = COLMODE_ONE;
	pPar.colpar[0] = ConvertGMColour(yyGetInt32(_colstart));
}



// #############################################################################################
/// Function:<summary>
///				Sets the color for the indicated particle type using 1 color
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="colstart"></param>
///			 <param name="_colend"></param>
///				
// #############################################################################################
function	ParticleType_Color2( _ind, _colstart, _colend)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.colmode = COLMODE_TWO;
	pPar.colpar[0] = ConvertGMColour(yyGetInt32(_colstart));
	pPar.colpar[1] = ConvertGMColour(yyGetInt32(_colend));
}


// #############################################################################################
/// Function:<summary>
///				Sets the color for the indicated particle type using 1 color
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="colstart"></param>
///			 <param name="_colmiddle"></param>
///			 <param name="_colend"></param>
///				
// #############################################################################################
function	ParticleType_Color3( _ind, _colstart, _colmiddle, _colend)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

    // Only use COLMODE_THREE with WebGL since it's inordinately slow otherwise
    pPar.colmode = (g_webGL === null) ? COLMODE_ONE : COLMODE_THREE;
    pPar.colpar[0] = ConvertGMColour(yyGetInt32(_colstart));
    pPar.colpar[1] = ConvertGMColour(yyGetInt32(_colmiddle));
    pPar.colpar[2] = ConvertGMColour(yyGetInt32(_colend));
}


// #############################################################################################
/// Function:<summary>
///				Sets the alpha transparency for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="alphastart"></param>
///				
// #############################################################################################
function	ParticleType_Alpha1(_ind, _alphastart)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	_alphastart = yyGetReal(_alphastart);

	pPar.alphastart = _alphastart;
	pPar.alphamiddle = _alphastart;
	pPar.alphaend = _alphastart;
}


// #############################################################################################
/// Function:<summary>
///				Sets the alpha transparency for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="alphastart"></param>
///			 <param name="alphaend"></param>
///				
// #############################################################################################
function	ParticleType_Alpha2(_ind, _alphastart, _alphaend)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	_alphastart = yyGetReal(_alphastart);
	_alphaend = yyGetReal(_alphaend);

	pPar.alphastart = _alphastart;
	pPar.alphamiddle = (_alphastart+_alphaend)/2.0;
	pPar.alphaend = _alphaend;
}


// #############################################################################################
/// Function:<summary>
///				Sets the alpha transparency for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="alphastart"></param>
///			 <param name="alphamiddle"></param>
///			 <param name="alphaend"></param>
///				
// #############################################################################################
function	ParticleType_Alpha3(_ind, _alphastart, _alphamiddle, _alphaend)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.alphastart = yyGetReal(_alphastart);
	pPar.alphamiddle = yyGetReal(_alphamiddle);
	pPar.alphaend = yyGetReal(_alphaend);
}

// #############################################################################################
/// Function:<summary>
///				Sets whether to use additive blending for the indicated particle type
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="additive"></param>
///				
// #############################################################################################
function	ParticleType_Blend(_ind, _additive)
{
    var pPar = g_ParticleTypes[yyGetInt32(_ind)];
	if( pPar == null || pPar==undefined ) return;

	pPar.additiveblend = yyGetReal(_additive);
}

// #############################################################################################
/// Function:<summary>
///				Creates an emitter, returning its index
///          </summary>
///
/// In:		 <param name="_ps"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleSystem_Emitter_Create(_ps)
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return -1;

	var ind = pPartSys.emitters.length;
	pPartSys.emitters[ind] = new yyEmitter();
	return ind;
}


// #############################################################################################
/// Function:<summary>
///				Destroys emitter ind in particle system ps
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_Emitter_Destroy(_ps, _ind)
{
    _ind = yyGetInt32(_ind);

    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;
	
	var pEmitter = pPartSys.emitters[_ind];
	if( pEmitter==null || pEmitter==undefined ) return false;

	pPartSys.emitters[_ind] = null;
	return true;
}


// #############################################################################################
/// Function:<summary>
///				Destroys all emmiters in particle system ps
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_Emitter_DestroyAll(_ps)
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;

	pPartSys.emitters = [];
	return true;
}


// #############################################################################################
/// Function:<summary>
///				Returns whether the emitter exists
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
/// Out:	<returns>
///				true for yes, false for no...
///			</returns>
// #############################################################################################
function	ParticleSystem_Emitter_Exists(_ps, _ind)
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;
	
	var pEmitter = pPartSys.emitters[yyGetInt32(_ind)];
	if( pEmitter==null || pEmitter==undefined ) return false;
	
	return true;	
}


// #############################################################################################
/// Function:<summary>
///				Clears emitter ind in particle system ps
///          </summary>
///
/// In:		<param name="ps"></param>
///			<param name="ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	ParticleSystem_Emitter_Clear(_ps, _ind)
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;
	
	var pEmitter = pPartSys.emitters[yyGetInt32(_ind)];
	if( pEmitter==null || pEmitter==undefined ) return false;
	 
	pEmitter.Reset();
}



// #############################################################################################
/// Function:<summary>
///				Sets the region for the emitter
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="ind"></param>
///			 <param name="xmin"></param>
///			 <param name="xmax"></param>
///			 <param name="ymin"></param>
///			 <param name="ymax"></param>
///			 <param name="shape"></param>
///			 <param name="posdistr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleSystem_Emitter_Region(_ps, _ind, _xmin, _xmax, _ymin, _ymax, _shape, _posdistr)
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;
	
	var pEmitter = pPartSys.emitters[yyGetInt32(_ind)];
	if( pEmitter==null || pEmitter==undefined ) return;


    pEmitter.xmin = yyGetReal(_xmin);
    pEmitter.xmax = yyGetReal(_xmax);
    pEmitter.ymin = yyGetReal(_ymin);
    pEmitter.ymax = yyGetReal(_ymax);
    pEmitter.shape = yyGetInt32(_shape);
    pEmitter.posdistr = yyGetInt32(_posdistr);
}


// #############################################################################################
/// Function:<summary>
///				Bursts number particles of the indicated type from the emitter
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="ind"></param>
///			 <param name="ptype"></param>
///			 <param name="numb"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleSystem_Emitter_Burst(_ps, _ind, _ptype, _numb)
{
    _ptype = yyGetInt32(_ptype);
    _numb = yyGetInt32(_numb);

	if ( _numb < 0 )
	{
	    // Cast to an integer
	    var rand = YYRandom(-_numb) | 0;
		if (rand == 0)
		{
			_numb = 1;
		}else{
			return;
		}
	}

	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;
	
	var pEmitter = pPartSys.emitters[yyGetInt32(_ind)];
	if( pEmitter==null || pEmitter==undefined ) return;


	for (var i = 0; i <= _numb - 1; i++)
	{
		var	xx,yy;
		var brk = false;

		while( brk==false )
		{
			xx = MyRandom(0.0, 1.0, pEmitter.posdistr);
			yy = MyRandom(0.0, 1.0, pEmitter.posdistr);
			if ( ( pEmitter.posdistr == PART_EDISTR_INVGAUSSIAN) && (pEmitter.shape != PART_ESHAPE_LINE) )
			{
				if ( YYRandom() < 0.5 ){
					xx = MyRandom(0.0, 1.0, 0);
				}else{
					yy = MyRandom(0.0, 1.0, 0);
				}
			}


			switch ( pEmitter.shape )
			{
				case PART_ESHAPE_RECTANGLE:		brk = true; break;														
				
				case PART_ESHAPE_ELLIPSE:{	//	if ( (Sqr(xx-0.5)+Sqr(yy-0.5)) <= Sqr(0.5) ) brk = true; break;		
				    var dx = xx-0.5;
				    var dy = yy-0.5;
				    if( (dx*dx + dy*dy) <= 0.25) brk = true;
				    break;
				}
				
				case PART_ESHAPE_DIAMOND:		if ( (Math.abs(xx-0.5)+Math.abs(yy-0.5)) <= 0.5 ) brk = true; break;		
				case PART_ESHAPE_LINE:			brk = true; break;
				default: 
					brk = true; break;
			}
		}

		if ( pEmitter.shape==PART_ESHAPE_LINE )
		{
			ParticleSystem_Particles_Create(_ps,pEmitter.xmin + (pEmitter.xmax-pEmitter.xmin)*xx,pEmitter.ymin + (pEmitter.ymax-pEmitter.ymin)*xx,_ptype,1);
		}
		else
		{
			ParticleSystem_Particles_Create(_ps,pEmitter.xmin + (pEmitter.xmax-pEmitter.xmin)*xx,pEmitter.ymin + (pEmitter.ymax-pEmitter.ymin)*yy,_ptype,1);
		}
	}
}



// #############################################################################################
/// Function:<summary>
///				Stream numb particles of the indicate type from the emitter
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="ind"></param>
///			 <param name="ptype"></param>
///			 <param name="_numb"></param>
///				
// #############################################################################################
function	ParticleSystem_Emitter_Stream( _ps, _ind, _ptype, _numb)
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;
	
	var pEmitter = pPartSys.emitters[yyGetInt32(_ind)];
	if( pEmitter==null || pEmitter==undefined ) return;

	pEmitter.number = yyGetInt32(_numb);
	pEmitter.parttype = yyGetInt32(_ptype);
}


// #############################################################################################
/// Function:<summary>
///				Creates numb particles of the indicated type at the indicated position
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="parttype"></param>
///			 <param name="numb"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ParticleSystem_Particles_Create(_ps, _x, _y, _parttype, _numb)
{
	_numb = yyGetInt32(_numb);
	_parttype = yyGetInt32(_parttype);

	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;
	
	var pParType = g_ParticleTypes[_parttype];
	if( pParType == null || pParType==undefined ) return false;

	for(var i = 0; i < _numb; i++)
	{
		var index = pPartSys.particles.length;
		pPartSys.particles[index] = CreateParticle(yyGetReal(_x), yyGetReal(_y), _parttype);
	}
}

// #############################################################################################
/// Function:<summary>
///				Creates numb particles of the indicated type at the indicated position
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="parttype"></param>
///			 <param name="numb"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleSystem_Particles_Create_Color( _ps, _x, _y, _parttype, _col, _numb)
{
    _numb = yyGetInt32(_numb);
    _parttype = yyGetInt32(_parttype);

	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;
	
	var pParType = g_ParticleTypes[_parttype];
	if( pParType == null || pParType==undefined ) return false;

	for(var i = 1; i <= _numb; i++)
	{
		var index = pPartSys.particles.length;
		pPartSys.particles[index] =  CreateParticle( yyGetReal(_x), yyGetReal(_y), _parttype );
		pPartSys.particles[index].color = ConvertGMColour(yyGetInt32(_col));
	}
}


// #############################################################################################
/// Function:<summary>
//				Removes all particles
///          </summary>
///
/// In:		 <param name="ps"></param>
///				
// #############################################################################################
function	ParticleSystem_Particles_Clear(_ps)
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;

	pPartSys.particles = [];
	return true;
}



// #############################################################################################
/// Function:<summary>
//				Removes all particles
///          </summary>
///
/// In:		 <param name="ps"></param>
///				
// #############################################################################################
function	ParticleSystem_Particles_Delete(_pParticles, _index)
{
	_pParticles.splice(_index,1);	
}


// #############################################################################################
/// Function:<summary>
////			Returns the number of particles
///          </summary>
///
/// In:		<param name="ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	ParticleSystem_Particles_Count( _ps )
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return 0 ;

	return pPartSys.particles.length;
}


// #############################################################################################
/// Function:<summary>
///				Creates a new particle system and returns its index
///          </summary>
///
/// Out:	<returns>
///				ID of the new particle system
///			</returns>
// #############################################################################################
function	ParticleSystem_Create(_layerID,_persistent)
{
    if (_layerID == undefined)
        _layerID = -1;
    else
        _layerID = yyGetInt32(_layerID);


    if (_persistent == undefined)
        _persistent = true;
    else
        _persistent = yyGetBool(_persistent);


 if (g_isZeus)
  {
      var pPartEl = null;      

      if (_layerID == -1) {
          pPartEl = new CLayerParticleElement();
          g_pLayerManager.AddNewElementAtDepth(g_RunRoom, 0, pPartEl, true, true);          
      }
      else
      {
          var room = g_pLayerManager.GetTargetRoomObj();

          if (room != null)
          {
              layer = g_pLayerManager.GetLayerFromID(room, _layerID);
              if (layer != null)
              {
                  pPartEl = new CLayerParticleElement();

                  // Since particle systems are persistent and to maintain similar behaviour to 1.x we don't just want to add the new particle system to the target room
                  // but to the current room too
                  if (room == g_RunRoom)
                  {
                      var res = g_pLayerManager.AddNewElement(g_RunRoom, layer, pPartEl, true);
                      if (res == -1)
                      {
                          g_pLayerManager.RemoveElementById(g_RunRoom, pPartEl.m_id, true);
                          pPartEl = null;
                      }
                  }
                  else
                  {
                      // Since we're not in the target room add this particle system to the current room too
                      g_pLayerManager.AddNewElementAtDepth(g_RunRoom, 0, pPartEl, true, true);
                  }
              }
          }
      }

      if (pPartEl == null)
          return -1;
  }


    var layer = null;
    var index = g_ParticleSystems.length;
    g_ParticleSystems[index] = new yyParticleSystem();
    g_ParticleSystems[index].id = index;                    // remember the ID


 

  if (g_isZeus)
  {
      g_ParticleSystems[index].m_elementID = -1;
      //g_ParticleSystems[index].m_origLayerID = -1;	
  }

  g_ParticleSystems[index].Clear();

 


  if (g_isZeus)
  {
      pPartEl.m_systemID = index;
      g_ParticleSystems[index].m_elementID = pPartEl.m_id;
      g_ParticleSystems[index].m_volatile = !_persistent;

      if (_layerID != -1)
      {
          layer = g_pLayerManager.GetLayerFromID(room, _layerID);

          //g_ParticleSystems[index].m_origLayerID = _layerID;
          g_ParticleSystems[index].depth = layer.depth;
      }
  }

  
  return index;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the particle system exists
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				true for yes, false for no.
///			</returns>
// #############################################################################################
function	ParticleSystem_Exists( _ps )
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return false;
	return true;
}



// #############################################################################################
/// Function:<summary>
///				Destroys the indicated particle system
///          </summary>
///
/// In:		<param name="ps"></param>
/// Out:	<returns>
///				true for destroyed, false for error.
///			</returns>
// #############################################################################################
function  ParticleSystem_Destroy( _ps )
{
    _ps = yyGetInt32(_ps);

	var pPartSys = g_ParticleSystems[_ps];
	if (pPartSys == null || pPartSys == undefined) return;

	ParticleSystem_Clear(_ps);

	g_ParticleSystems[_ps] = null;
	return true;
}


// #############################################################################################
/// Function:<summary>
///				Destroys all particle systems
///          </summary>
// #############################################################################################
function ParticleSystem_DestroyAll()
{
    for (var i = 0; i < g_ParticleSystems.length; i++)
    {
        if ((g_ParticleSystems[i] != null) && (g_ParticleSystems[i] != undefined)) {
            ParticleSystem_Clear(i);
        }
    }

	g_ParticleSystems = [];
}


// #############################################################################################
/// Function:<summary>
///          	Clear a particle system out.
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_Clear( _ps )
{
    _ps = yyGetInt32(_ps);

	var pPartSys = g_ParticleSystems[_ps];
	if (pPartSys == null || pPartSys == undefined) return;

	if (g_isZeus)
	{
	    // Remove this from any layer it happens to be on
	    if (g_ParticleSystems[_ps].m_elementID !== undefined) {
	        g_pLayerManager.RemoveElementById(g_RunRoom, g_ParticleSystems[_ps].m_elementID, true);
	    }
	    g_ParticleSystems[_ps].m_elementID = -1;
	    //g_ParticleSystems[_ps].m_origLayerID = -1;
	    g_ParticleSystems[_ps].m_volatile = false;
	}
	pPartSys.Clear();
}

function ParticleSystem_GetLayer(_ps)
{
    if (!ParticleSystem_Exists(_ps))
        return -1;

    var pLayer = null;
    var elandlay = g_pLayerManager.GetElementAndLayerFromID(g_RunRoom, g_ParticleSystems[_ps].m_elementID);
    if (elandlay == null)
        return -1;
    pLayer = elandlay.layer;
    if (pLayer == null)
    {
        return -1;
    }

    return pLayer.m_id;
}

function ParticleSystem_Layer(_ps,_layerID)
{
    if (!ParticleSystem_Exists(_ps))
        return;

    if (g_isZeus)
    {
        // Remove this from any layer it happens to be on and re-add it again
        g_pLayerManager.RemoveElementById(g_RunRoom, g_ParticleSystems[_ps].m_elementID, true);
        var pPartEl = new CLayerParticleElement();
        pPartEl.m_systemID = _ps;
        //g_ParticleSystems[_ps].m_origLayerID = _layerID;    // reset the associated layer id

        var room = g_pLayerManager.GetTargetRoomObj();
        if (room != null)
        {
            var layer = g_pLayerManager.GetLayerFromID(room, _layerID);
            if (layer != null)
            {
                // Add this particle system to the layer system

                if (room == g_RunRoom)
                {
                    g_ParticleSystems[_ps].m_elementID = g_pLayerManager.AddNewElement(g_RunRoom, layer, pPartEl, true);
                    g_ParticleSystems[_ps].depth = layer.depth;	// reset depth
                    if (g_ParticleSystems[_ps].m_elementID == -1)
                    {
                        g_pLayerManager.RemoveElementById(g_RunRoom, pPartEl.m_id, true);                        
                    }
                }
            }

            if (g_ParticleSystems[_ps].m_elementID == -1)
            {
                g_ParticleSystems[_ps].m_elementID = g_pLayerManager.AddNewElementAtDepth(g_RunRoom, g_ParticleSystems[_ps].depth, pPartEl, true, true);
            }
        }
    }
}

// #############################################################################################
/// Function:<summary>
///          	Clear all particle systems out.
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_ClearParticles()
{    
    for (var ps = 0; ps < g_ParticleSystems.length; ps++) 
    {
        if (!g_ParticleSystems.hasOwnProperty(ps)) continue;
    
        var pPartSys = g_ParticleSystems[ps];
	    if (pPartSys) {	    
            pPartSys.particles = [];
        }
    }
}


// #############################################################################################
/// Function:<summary>
///				Sets the drawing order for the particle system
///          </summary>
///
/// In:		<param name="ps"></param>
///			<param name="oldtonew"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_DrawOrder(_ps, _oldtonew) 
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;

	pPartSys.oldtonew = _oldtonew;
}

// #############################################################################################
/// Function:<summary>
///				Sets the depth for the particle system
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="depth"></param>
///				
// #############################################################################################
function ParticleSystem_Depth(_ps, _depth)
{
    _ps = yyGetInt32(_ps);

	var pPartSys = g_ParticleSystems[_ps];
	if( pPartSys ==null || pPartSys==undefined ) return;

	pPartSys.id = _ps;
	pPartSys.depth = yyGetReal(_depth);
	g_ParticleChanges.push({ part_sys: pPartSys, type: 0 } );
    
    /*
    // This must be defered till the end of the event - like instance depth change
	if (g_isZeus)
	{
	    // Remove this from any layer it happens to be on and re-add it again
	    g_pLayerManager.RemoveElementById(g_RunRoom, pPartSys.m_elementID, true);
	    var pPartEl = new CLayerParticleElement();
	    pPartEl.m_systemID = _ps;
	    g_ParticleSystems[_ps].m_origLayerID = -1;  // scrub any associated layer ID if we're manually changing depth
	    g_ParticleSystems[_ps].m_elementID = g_pLayerManager.AddNewElementAtDepth(g_RunRoom, g_ParticleSystems[_ps].depth, pPartEl, true, true);
	}*/
}


// #############################################################################################
/// Function:<summary>
///				Sets the drawing position for the particle system
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	ParticleSystem_Position(_ps, _x, _y)
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;

	pPartSys.xdraw = yyGetReal(_x);
	pPartSys.ydraw = yyGetReal(_y);
}


// #############################################################################################
/// Function:<summary>
///				Sets whether to use automatic updating for the particle system
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_automatic"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_AutomaticUpdate( _ps, _automatic)
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;

	pPartSys.automaticupdate = yyGetBool(_automatic);
}

// #############################################################################################
/// Function:<summary>
///          	Sets whether to use automatic drawing for the particle system
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_automatic"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_AutomaticDraw(_ps, _automatic)
{
	var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if( pPartSys ==null || pPartSys==undefined ) return;

	pPartSys.automaticdraw = yyGetBool(_automatic);
}




// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function HandleLife( _ps )
{
	var i = 0;
	var numb = 0;
	var ind = 0;

	var pPartSys = g_ParticleSystems[_ps];
	var pParticles = pPartSys.particles;	
	i = 0;
	while( i<pParticles.length )
	{
			
		var pParticle = pParticles[i];
		var pParType = g_ParticleTypes[ pParticle.parttype ];

		// Update the age and create death particles
		pParticle.age++;
			
		if ( pParticle.age >= pParticle.lifetime )			// change this to a check with 0... and count age down.
		{
			numb = pParType.deathnumber;
			if ( numb<0 ){
				if ( YYRandom(-numb) == 0 ) numb = 1;
			}
			if  ( numb > 0 ){
				ParticleSystem_Particles_Create( _ps, pParticle.x, pParticle.y, pParType.deathtype, numb);
			}
			pParticles.splice(i,1);	// remove particle
		}else{	
			// Create step particles
			numb = pParType.stepnumber;
			if ( numb<0 ){
				if ( YYRandom(-numb) == 0 ) numb = 1;
			}
			if ( numb > 0 ){
				ParticleSystem_Particles_Create(_ps, pParticle.x, pParticle.y, pParType.steptype,numb);
			}
		
			i++;		// next particle. Dont do if we deleted one, because SPLICE moves them all down...
		}
	}
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_ps"></param>
///				
// #############################################################################################
function HandleMotion( _ps )
{
	var i = 0;
	var j = 0;
	var hspeed = 0.0;
	var vspeed = 0.0;
	var h2 = 0.0;
	var v2 = 0.0;
	var ah = 0.0;
	var av = 0.0;
	var adist = 0.0;
	var hspeedtemp = 0.0;
	var vspeedtemp = 0.0;
	var rd = 0.0;
	var rs = 0.0;

	var pPartSys = g_ParticleSystems[_ps];
	var pParticles = pPartSys.particles;	
	for( i=0; i<pParticles.length; i++)
	{
		var pParticle = pParticles[i];
		var pParType = g_ParticleTypes[ pParticle.parttype ];
	
		// adapt speed and direction and angle
		pParticle.speed = pParticle.speed + pParType.spincr;
		if ( pParticle.speed < 0 ) pParticle.speed = 0;
		pParticle.dir = pParticle.dir + pParType.dirincr;
		pParticle.ang = pParticle.ang + pParType.angincr;
		hspeedtemp = 0;
		vspeedtemp = 0;


		if ( (pParType.grav != 0) || (pPartSys.acount > 0) )
		{
			hspeed = Direction_To_Vector_h( pParticle.dir,pParticle.speed );
			vspeed = Direction_To_Vector_v( pParticle.dir,pParticle.speed );

			// apply gravity
			if (pParType.grav != 0)
			{
				h2 = Direction_To_Vector_h( pParType.gravdir,pParType.grav );
				v2 = Direction_To_Vector_v( pParType.gravdir,pParType.grav );
				hspeed = hspeed + h2;
				vspeed = vspeed + v2;
			}

			// adapt the speed and direction
			pParticle.dir = Vector_To_Direction(hspeed,vspeed ); 
			pParticle.speed = Math.sqrt(hspeed*hspeed + vspeed*vspeed);
		}


		// deal with random additions
		rd = ((pParticle.age+3*pParticle.ran) % 24)/6.0;
		if (rd > 2.0) { rd = 4.0 - rd; }
		rd = rd-1.0;

		rs = ((pParticle.age+4*pParticle.ran) % 20)/5.0;
		if ( rs > 2.0 ) { rs = 4.0-rs; }
		rs = rs-1.0;

		hspeed = Direction_To_Vector_h(pParticle.dir+rd * pParType.dirrand,pParticle.speed+rs * pParType.sprand);
		vspeed = Direction_To_Vector_v(pParticle.dir+rd * pParType.dirrand,pParticle.speed+rs * pParType.sprand);
		pParticle.x = pParticle.x + hspeed + hspeedtemp;
		pParticle.y = pParticle.y + vspeed + vspeedtemp;
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function  HandleShape(_ps)
{
	var pPartSys = g_ParticleSystems[_ps];
	var pParticles = pPartSys.particles;	
	
	for(var i=0 ; i<pParticles.length; i++ )
	{
		var pParticle = pParticles[i];
		var pParType = g_ParticleTypes[ pParticle.parttype ];
		
		
		// adapt the size
		pParticle.size = pParticle.size + pParType.sizeincr;
		if ( pParticle.size < 0 ) { pParticle.size = 0; }
		
		
		// adapt the color
		Compute_Color( pParticle );
		
		
		// handle alpha blending
		var passed;
		if ( pParticle.lifetime > 0 ) { 
			passed = 2.0 * pParticle.age/pParticle.lifetime; 
		} else { 
			passed = 1; 
		}
		
		if ( passed < 1 ){
			pParticle.alpha = pParType.alphastart*(1.0-passed) + pParType.alphamiddle*passed;
		}else{
			pParticle.alpha = pParType.alphamiddle*(2.0-passed) + pParType.alphaend*(passed-1);
		}
	}
}



// #############################################################################################
/// Function:<summary>
///				Does a time step, updating all the particles and emitters
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParticleSystem_Update(_ps)
{
    _ps = yyGetReal(_ps);

	var pPartSys = g_ParticleSystems[_ps];
	if( pPartSys ==null || pPartSys==undefined ) return 0 ;

	HandleLife(_ps);
	HandleMotion(_ps);
	HandleShape(_ps);

  // Create new particles
	var pEmitters = pPartSys.emitters;
	if (pEmitters)
	{
		for (var i = 0; i < pEmitters.length; i++)
		{
			if( pEmitters[i]!=null && pEmitters[i].number != 0)
			{
				ParticleSystem_Emitter_Burst(_ps, i, pEmitters[i].parttype, pEmitters[i].number);
			}
		}
	}
}


// #############################################################################################
/// Function:<summary>
///				Does a time step for all particle systems, updating all the particles and emitters
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function  ParticleSystem_UpdateAll()
{
	for (var i=0; i<g_ParticleSystems.length; i++ )
	{
		var pPartSys = g_ParticleSystems[i];
		if (pPartSys != null)
		{
			if (pPartSys.automaticupdate)
			{
				ParticleSystem_Update(i);
			}
		}
	}
}



// #############################################################################################
/// Function:<summary>
///				Draws a particle
///          </summary>
///
/// In:		 <param name="part"></param>
///			 <param name="xoff"></param>
///			 <param name="yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	DrawParticle(_pParticle, _xoff, _yoff)
{
	var spr= null;
	var pTexture=null;

	if ( _pParticle.lifetime <= 0 ) return;
	var pParType = g_ParticleTypes[ _pParticle.parttype ];


	spr = g_pSpriteManager.Get( pParType.sprite );
	if( spr == null )
	{
		var shape = pParType.shape;
		if ( (shape >= 0) && (shape < PART_SPRITE_NUMB) )
		{
			pTexture = g_ParticleTextures[ shape ];		// get pTPE
			if(pTexture==null)
			{
			    //They have probably switched off default particles, yet are trying to draw with them...
			    return;
			}
		}
		else{
			return; // illegal shape.
		}
	}


	var n ;

	// If a default particle, then no animation for it, just draw it.
	if( pTexture!=null ){
		

	}else{
		if ( spr.num <= 0 ) return;

		if ( !pParType.spriteanim )
		{
			n = _pParticle.spritestart;
		}
		else if ( pParType.spritestretch )
		{
			n = _pParticle.spritestart + (spr.numb * _pParticle.age/_pParticle.lifetime);
		}
		else
		{
			n = _pParticle.spritestart + _pParticle.age;
		}
	}

	// adapt to random angle
	var r = ((_pParticle.age+2*_pParticle.ran) % 16)/4.0;
	if ( r > 2.0 ) r = 4.0-r;
	r = r-1.0;

	var aa = _pParticle.ang;
	if ( pParType.angdir ) aa = aa + _pParticle.dir;
	aa = aa + r*pParType.angrand;


	// adapt to random size
	r = ((_pParticle.age+_pParticle.ran) % 16)/4.0;
	if ( r > 2.0 ) r = 4.0-r;
	r = r-1.0;
	
	// Set the blend mode to additive if the particles is set to be additive.
	// This is reset in ParticleSystem_Draw after all particles have been drawn.
	if(_pParticle.additiveblend)
	{
		draw_set_blend_mode(1);
	}

	var s = _pParticle.size + r*pParType.sizerand;   

	// If a built in particle, make it right here...
	var c = _pParticle.color;
	if (pTexture != null)
	{
		var xscale,yscale,ang;
		var xsc = pParType.xscale*s;
		var ysc = pParType.yscale*s;
		var rot = aa;

		var _X = ~~(_pParticle.x+_xoff);
		var _Y = ~~(_pParticle.y+_yoff);

		if( xsc==1 && ysc==1 && rot == 0 && _pParticle.color==0xffffff ){
			Graphics_TextureDrawSimple( pTexture, _X, _Y, _pParticle.alpha);
		} else
		{
			//debug("X=" + _X + ",Y=" + _Y + ",  xsc=" + xsc + ",ysc=" + ysc + ",  rot=" + rot + ",  col=" + _pParticle.color + ",  a=" + _pParticle.alpha);
			Graphics_TextureDraw(pTexture, 0, 0, _X, _Y, xsc, ysc, rot * 0.017453293, c, c,c,c, _pParticle.alpha);
		}
	}else{
		// If a user supplied particle, call via sprite handler to draw it.
		spr.Draw( n,	_pParticle.x+_xoff,_pParticle.y+_yoff, 
						g_ParticleTypes[_pParticle.parttype].xscale*s, g_ParticleTypes[_pParticle.parttype].yscale*s,
						aa,
						c,
						_pParticle.alpha
				);		
	}
}




// #############################################################################################
/// Function:<summary>
///				Draws the particles on the canvas at the indicated offset
///          </summary>
///
/// In:		 <param name="ps"></param>
///
// #############################################################################################
function ParticleSystem_Draw( _ps )
{
    var pPartSys = g_ParticleSystems[yyGetInt32(_ps)];
	if (pPartSys == null || pPartSys == undefined) return;

	var src, dest;
	if (g_webGL != null)
	{
	    src = GR_BlendSrc;
	    dest = GR_BlendDest;
	}
    
	var pParticles = pPartSys.particles;
	if ( pPartSys.oldtonew )
	{
		for (var i = 0; i < pPartSys.particles.length; i++)
		{            	
			DrawParticle( pParticles[i], pPartSys.xdraw, pPartSys.ydraw );
		}
	}
	else
	{
		for(var i=pPartSys.particles.length-1 ; i >= 0 ; i-- )
		{
			DrawParticle( pParticles[i], pPartSys.xdraw, pPartSys.ydraw );
		}
	}

	if (g_webGL != null) {
	    draw_set_blend_mode_ext(src, dest);
	}
	else {	    
	    draw_set_blend_mode(0);
	}
}




// #############################################################################################
/// Function:<summary>
///				Draws all particle system with depth equal to d
///          </summary>
///
/// In:		 <param name="d">Depth to draw</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ParticleSystem_DrawDepth(_d)
{
	for(var i=0 ; i<g_ParticleSystems.length; i++)
	{
		var pPartSys = g_ParticleSystems[i];

		if (pPartSys != null)
		{
			if (pPartSys.automaticdraw)
			{
				if (Math.abs(pPartSys.depth - _d) < 0.01) ParticleSystem_Draw(i);
			}
		}
	}
}


function ParticleSystem_AddAllToLayers() {
    if (g_isZeus)
    {
        if (persistentsystemlayernames.length < g_ParticleSystems.length)
        {
            var oldlength = persistentsystemlayernames.length;
            for(var i = oldlength; i < g_ParticleSystems.length; i++)
            {
                persistentsystemlayernames[i] = null;
            }
        }
        for(var i = 0; i < g_ParticleSystems.length; i++)
        {
            var pPartSys = g_ParticleSystems[i];
            if (pPartSys != null)
            {
                if (pPartSys.m_elementID == -1)
                {
                    var pTempLayer = null;
                    var pLayerName = persistentsystemlayernames[i];
                    if (pLayerName != null)
                    {
                        // Use the same logic as persistent objects to look for a layer with a matching name	
                        pTempLayer = g_pLayerManager.GetLayerFromName(g_RunRoom, pLayerName);
                        if (pTempLayer == null)
                        {
                            // We didn't find a matching layer, so create one with that name and the particle system's depth
                            pTempLayer = g_pLayerManager.AddLayer(g_RunRoom, pPartSys.depth, pLayerName);
                        }
                    }

                    // Add this particle system to the layer system
                    var pPartEl = new CLayerParticleElement();
                    pPartEl.m_systemID = i;

                    if (pTempLayer != null)
                    {
                        pPartSys.m_elementID = g_pLayerManager.AddNewElement(g_RunRoom, pTempLayer, pPartEl, true);
                    }                    

                    if (pPartSys.m_elementID == -1)
                    {
                        // If no layer was specified, or if the specified layer doesn't exist in the current room, add the element at the system depth
                        pPartSys.m_elementID = g_pLayerManager.AddNewElementAtDepth(g_RunRoom, pPartSys.depth, pPartEl, true, true);
                    }                    
                }
            }
        }

        persistentsystemlayernames = [];
    }
};

function ParticleSystem_RemoveAllFromLayers()
{
    if (g_isZeus)
    {
        for(var i = 0; i < g_ParticleSystems.length; i++)
        {
            var pPartSys = g_ParticleSystems[i];
            if (pPartSys != null)
            {
                var pTempLayer = null;

                if (pPartSys.m_elementID != -1)
                {
                    // Get layer
                    var elandlay = g_pLayerManager.GetElementAndLayerFromID(g_RunRoom, pPartSys.m_elementID);
                    if (elandlay != null)
                    {
                        pTempLayer = elandlay.layer;
                    }

                    g_pLayerManager.RemoveElementById(g_RunRoom, g_ParticleSystems[i].m_elementID, true);
                    pPartSys.m_elementID = -1;
                }

                if (pPartSys.m_volatile == true)
                {
                    ParticleSystem_Destroy(i);  // this particle system is volatile so nuke it

                    persistentsystemlayernames[i] = null;
                }
                else
                {
                    if (pTempLayer != null)
                    {
                        if (pTempLayer.m_dynamic == true)
                        {
                            persistentsystemlayernames[i] = null;
                        }
                        else
                        {
                            persistentsystemlayernames[i] = pTempLayer.m_pName;
                        }
                    }
                    else
                    {
                        persistentsystemlayernames[i] = null;
                    }
                }
            }
        }
    }
}

function ParticleSystem_AutoDraw(_ps) {

    _ps = yyGetInt32(_ps);

    if (true == ParticleSystem_Exists(_ps)) {
        var pPartSys = g_ParticleSystems[_ps];

        if (pPartSys != null) {
            if (pPartSys.automaticdraw) {
                ParticleSystem_Draw(_ps);
            }
        }
    }
};




// #############################################################################################
/// Function:<summary>
///				Returns the largest depth of a particle system
///          </summary>
///
/// Out:	 <returns>
///				the largest depth
///			 </returns>
// #############################################################################################
function  ParticleSystem_LargestDepth()
{
	var	Result = -1000000000;

	for(var i=0 ; i<g_ParticleSystems.length; i++ )
	{
		var pPartSys = g_ParticleSystems[i];
		if (pPartSys != null && pPartSys.particles.length>0)
		{
			if (pPartSys.automaticdraw) 
			{
				if (pPartSys.depth > Result) Result = pPartSys.depth;
			}
		}
	}
	return Result;
}



// #############################################################################################
/// Function:<summary>
///				Returns the largest depth smaller than d of a particle system
///          </summary>
///
/// In:		 <param name="d">Depth the start from</param>
/// Out:	 <returns>
///				Next depth
///			 </returns>
// #############################################################################################
function ParticleSystem_NextDepth(_d)
{
	var Result = -1000000000;

	for(var i=0 ; i<g_ParticleSystems.length; i++ )
	{
		var pPartSys = g_ParticleSystems[i];
		if (pPartSys != null && pPartSys.particles.length>0)
		{
			if (pPartSys.automaticdraw)
			{
				if ((pPartSys.depth > Result) && (pPartSys.depth < _d)) Result = pPartSys.depth;
			}
		}
	}

	return Result;
}
