import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  formGroup!: FormGroup;
  imageBase64 !: '';

  constructor(private fb: FormBuilder, private bs: BackendService) {
    // constructor function
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
          inp_title: ['', Validators.required],
          inp_author: ['', Validators.required],
          inp_genre: ['', Validators.required],
          inp_publisher: ['', Validators.required],
          inp_location: ['', Validators.required],
          inp_published: ['', Validators.required],
          inp_image: ['', Validators.required]
    });
  }

  get inp_title(): FormControl {
    return this.formGroup.get('inp_title') as FormControl;
  }

  get inp_author(): FormControl {
      return this.formGroup.get('inp_author') as FormControl;
    }

  get inp_genre(): FormControl {
      return this.formGroup.get('inp_genre') as FormControl;
    }

  get inp_publisher(): FormControl {
      return this.formGroup.get('inp_publisher') as FormControl;
    }

  get inp_location(): FormControl {
    return this.formGroup.get('inp_location') as FormControl;
  }

  get inp_published(): FormControl {
      return this.formGroup.get('inp_published') as FormControl;
    }

  get inp_image(): FormControl {
    return this.formGroup.get('inp_image') as FormControl;
  }

  onSubmit(): void
    {
        const post = {
          id: null,
          title: this.inp_title.value,
          author: this.inp_author.value,
          genre: this.inp_genre.value,
          publisher: this.inp_publisher.value,
          location: this.inp_location.value,
          published: this.inp_published.value,
          image: this.imageBase64
        }
        console.log('post : ', post);
        this.bs.addPost(post);
    }

    uploadFileEvt(imgFile: any): void {
        console.log('upload', imgFile.target.files);

        if(imgFile.target.files && imgFile.target.files[0])
        {
          const reader = new FileReader();
          reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            const imgBase64Path = e.target.result;
            console.log('base64', imgBase64Path);
            this.imageBase64 = imgBase64Path.substr(imgBase64Path.indexOf(',')+1);
          };
          };
          reader.readAsDataURL(imgFile.target.files[0]);
        }
    }
}


