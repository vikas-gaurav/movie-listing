import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { IMovie } from '../interfaces';
import { timer as observableTimer, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  public movies: Array<IMovie>;
  public moviesCopy : Array<IMovie>;
  public totalMovies = 0;
  public currentPage = 0;
  public isError = false;
  public isModal = false;
  public movieInModal?: IMovie;
  public isSearchActive  = false;
  constructor(private appService: AppService) {
    console.log(`MoviesComponent :: constructor ::constructor initialized`);
  }
  private _cancel$ = new Subject<void>();

  ngOnInit() {
    console.log(`MoviesComponent :: ngOnInit :: initialized`);
    this._updateMovies(this.currentPage);
  }

  public changePage(event: any) {
    console.log(`Page event`, event);
    this.currentPage = event.pageIndex;
    this._updateMovies(this.currentPage);
  }

  public refreshPage() {
    console.log(`MoviesComponent :: refreshPage :: initialized`);
    this._updateMovies(this.currentPage);
  }

  public showInModal(movie_: IMovie) {
    console.log(`MoviesComponent :: showInModal :: entering with:`, movie_);
    this.isModal = true;
    this.movieInModal = movie_;
  }

  public filterList(text_: string) {
    if(text_ && text_.length > 3){
      console.log(`AppComponent :: onNameChange :: text to search:`, text_);
      this._cancel$.next();
      text_ = text_.toLowerCase();
      // debouncing, this waits for 250ms before start filtering
      observableTimer(250).pipe(takeUntil(this._cancel$)).subscribe((_) => {
        const filterList_ = this.movies.filter(movie_ => movie_.title.toLowerCase().includes(text_));
        console.log(`AppComponent :: onNameChange :: filtering list:`, filterList_);
        this.movies = filterList_;
        this.isSearchActive = true;
      });
    }
    else{
      this.movies = this.moviesCopy;
      this.isSearchActive = false;
    }
  }

  public closeModal() {
    this.isModal = false;
    this.movieInModal = undefined;
  }

  private _updateMovies(page_: number) {
    if (this.appService && this.appService.getMovies) {
      this.appService.getMovies(page_ + 1).subscribe((res_: { count: number, results: Array<IMovie> }) => {
        console.log(`MoviesComponent :: getMovies :: API res_`, res_);
        this.movies = this.moviesCopy = res_.results;
        this.totalMovies = res_.count;
        this.isError = false;
        console.log(`MoviesComponent :: getMovies :: movieList`, this.movies);
      }, err_ => {
        console.log(`Error occured`, err_);
        this.isError = true;
      });
    }
  }
}
