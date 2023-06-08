import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries/countries.service';
import { Region, SmallCountry, Country } from '../../interfaces/country.interfaces';
import { Observable, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = []
  public borders: SmallCountry[] = []

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) { }

  ngOnInit(): void {
    this.onRegionChanged(),
      this.onCountryChanged()
  }

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  get regions(): Region[] {
    return this.countriesService.regions
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders = []),
        switchMap(region => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.countriesByRegion = countries
      })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(smallCountry => this.countriesService.getCountryBordersByCodes(smallCountry.borders))
      )
      .subscribe(smallCountries => {
        this.borders = smallCountries
      })
  }



}
