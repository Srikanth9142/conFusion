import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { Params,ActivatedRoute } from '@angular/router';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { trigger,state,animate,style,transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[trigger('visibility',[
    state('shown',style({
      transform:'scale(1.0)',
      opacity:1
    })),
    state('hidden',style({
      transform:'scale(0.5)',
      opacity:0
    })),
    transition('* => *',animate('0.5s ease-in-out'))
  ])]
})
export class DishdetailComponent implements OnInit {
 
  dish:Dish;
  dishcopy:Dish;
  dishIds:string[];
  prev:string;
  next:string;
  commentForm:FormGroup;
  newcomment:Comment;
  errMes:string;
  visibility='shown';

  @ViewChild('fform') commentFormDirective;
  formErrors={
    'comment':'',
    'author':''
  };

  validationMessages={
    'comment':{
      'required':'Comment is Required',
      'minlength':'Comment must be 2 charactes long.'
    },
    'author':{
      'required':'Author name is Required',
      'minlength':'Author name must be 2 characters long'
    }
  };

  constructor(private route:ActivatedRoute,private dishService:DishService,private location:Location,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createCommentForm();
    }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishids=>this.dishIds = dishids);
    this.route.params.pipe(switchMap((params:Params)=>{this.visibility='hidden'; return this.dishService.getDish(params['id'])}))
    .subscribe(dish=>{this.dish = dish;this.dishcopy=dish; this.setPrevNext(dish.id);this.visibility='shown';},errmes=>this.errMes = <any>errmes);
    
    
  }

  setPrevNext(dishId:string):void{
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack():void{
    this.location.back();
  }

  createCommentForm(){
    this.commentForm = this.fb.group({
      rating:5,
      comment:['',[Validators.required,Validators.minLength(2)]],
      author:['',[Validators.required,Validators.minLength(2)]],
    });

    this.commentForm.valueChanges.subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();

  }

  onSubmit(){

    this.newcomment = new Comment();
    console.log(this.commentForm.value);
      this.newcomment.rating = this.commentForm.get('rating').value;
      this.newcomment.author = this.commentForm.get('author').value;
      this.newcomment.comment = this.commentForm.get('comment').value;
      this.newcomment.date = new Date().toISOString();
      console.log(this.newcomment);
      this.dishcopy.comments.push(this.newcomment);
      this.dishService.putDish(this.dish).subscribe(dish=>{
        this.dish = dish;
        this.dishcopy = dish;
      },errmes=>{
        this.errMes = <any>errmes;
        this.dish = null;
        this.dishcopy = null;
      })
      this.commentForm.reset({
        rating:5,
        comment:'',
        author:''
      });
      
      this.commentFormDirective.resetForm({rating:5});

  }

  onValueChanged(data?:any){

    if(!this.commentForm){
      return;
    }
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const message = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field]+=message[key]+' ';
            }
            
          }
        }
      }
     
    }
  }

}
