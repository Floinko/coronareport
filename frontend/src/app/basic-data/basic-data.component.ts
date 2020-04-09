import { SnackbarService } from 'src/app/services/snackbar.service';
import { FirstQuery } from './../models/first-query';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ContactPersonDto } from 'src/app/models/contact-person';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import '../utils/date-extensions';
import { MatDialog } from '@angular/material/dialog';
import { ContactPersonDialogComponent } from '../contact/contact-person-dialog/contact-person-dialog.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Moment } from 'moment';

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss']
})
export class BasicDataComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // ########## STEP I ##########
  firstFormGroup: FormGroup;

  // ########## STEP II ##########
  secondFormGroup: FormGroup;
  firstQuery: FirstQuery;

  // ########## STEP III ##########
  thirdFormGroup: FormGroup;
  datesForRetrospectiveContacts: Date[] = [];
  contactPersons: ContactPersonDto[] = [];
  noRetrospectiveContactsConfirmed = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.subs.add(this.route.data.subscribe(data => {
      this.contactPersons = data.contactPersons;
      this.firstQuery = data.firstQuery;
      this.buildForms();
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  buildForms() {
    this.buildFirstForm();
    this.buildSecondForm();
    this.buildThirdForm();
  }

  onTabChanged(event: StepperSelectionEvent) {
    if (event.selectedIndex === 2) {
      this.buildThirdForm();
    }
  }

  // ########## STEP I ##########

  buildFirstForm() {
    this.firstFormGroup = this.formBuilder.group({
      // ToDo: Basic Data Step 1
      firstCtrl: ['', Validators.required]
    });
  }

  // ########## STEP II ##########

  get dayOfFirstSymptoms() {
    const dateValue = this.secondFormGroup?.controls.dayOfFirstSymptoms.value;
    if (dateValue?.toDate instanceof Function) {
      const date = (dateValue as Moment).toDate();
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    if (dateValue) {
      return dateValue as Date;
    }
    return null;
  }

  buildSecondForm() {
    this.secondFormGroup = new FormGroup({
      min15MinutesContactWithC19Pat: new FormControl(this.firstQuery.min15MinutesContactWithC19Pat, [Validators.required]),
      nursingActionOnC19Pat: new FormControl(this.firstQuery.nursingActionOnC19Pat, [Validators.required]),
      directContactWithLiquidsOfC19Pat: new FormControl(this.firstQuery.directContactWithLiquidsOfC19Pat, [Validators.required]),
      flightPassengerWithCloseRowC19Pat: new FormControl(this.firstQuery.flightPassengerWithCloseRowC19Pat, [Validators.required]),
      flightAsCrewMemberWithC19Pat: new FormControl(this.firstQuery.flightAsCrewMemberWithC19Pat, [Validators.required]),
      belongToMedicalStaff: new FormControl(this.firstQuery.belongToMedicalStaff, [Validators.required]),
      belongToNursingStaff: new FormControl(this.firstQuery.belongToNursingStaff, [Validators.required]),
      belongToLaboratoryStaff: new FormControl(this.firstQuery.belongToLaboratoryStaff, [Validators.required]),
      familyMember: new FormControl(this.firstQuery.familyMember, [Validators.required]),
      dayOfFirstSymptoms: new FormControl(this.firstQuery.dayOfFirstSymptoms),
      otherContactType: new FormControl(this.firstQuery.otherContactType),
      hasSymptoms: new FormControl(this.firstQuery.hasSymptoms, [Validators.required])
    }, this.firstSymptomsValidator);

    this.secondFormGroup.controls.hasSymptoms.valueChanges.subscribe((value: boolean) => {
      if (!value) {
        this.secondFormGroup.controls.dayOfFirstSymptoms.setValue(null);
      }
    });

    this.secondFormGroup.valueChanges.subscribe((value) => {
      value.dayOfFirstSymptoms = this.dayOfFirstSymptoms;
      // ToDo: PUT Endpunkt in api aufrufen
      this.firstQuery = value;
      this.snackbarService.success('Fragebogen erfolgreich gespeichert');
    });
  }

  firstSymptomsValidator(g: FormGroup) {
    if (g.controls.hasSymptoms.value) {
      return g.controls.dayOfFirstSymptoms.value ? null : { required: true };
    }
    return null;
  }

  // ########## STEP III ##########

  buildThirdForm() {
    this.thirdFormGroup = this.formBuilder.group({
      noRetrospectiveContactsConfirmed: new FormControl(false)
    });
    let day = new Date(this.today);
    this.datesForRetrospectiveContacts = [];
    const firstSymptomsDay = this.firstQuery.dayOfFirstSymptoms || new Date(this.today);
    const firstDay = firstSymptomsDay.addDays(-2);
    while (day >= firstDay) {
      this.datesForRetrospectiveContacts.push(day);
      this.thirdFormGroup.addControl(day.toLocaleDateString(), new FormControl([]));
      day = day.addDays(-1);
    }
  }

  openContactDialog() {
    const dialogRef = this.dialog.open(ContactPersonDialogComponent, {
      height: '90vh',
      data: {
        contactPerson: { id: null, surename: null, firstname: null, phone: null, email: null },
      }
    });

    this.subs.add(dialogRef.afterClosed().subscribe((createdContact: ContactPersonDto | null) => {
      if (createdContact) {
        this.contactPersons.push(createdContact);
      }
    }));
  }

  onContactAdded(date: Date, id: number) {
    // ToDo: call api post
    this.snackbarService.success('Kontakt erfolgreich gespeichert');
  }

  onContactRemoved(date: Date, id: number) {
    // ToDo: call api delete
    this.snackbarService.success('Kontakt erfolgreich entfernt');
  }

  hasRetrospectiveContacts(): boolean {
    let result = false;
    Object.keys(this.thirdFormGroup.controls).forEach(key => {
      if (key !== 'noRetrospectiveContactsConfirmed') {
        if (this.thirdFormGroup.controls[key].value.length > 0) {
          result = true;
        }
      }
    });
    return result;
  }

  hasNoRetrospectiveContactsConfirmed(): boolean {
    return this.thirdFormGroup.controls.noRetrospectiveContactsConfirmed.value;
  }
}
