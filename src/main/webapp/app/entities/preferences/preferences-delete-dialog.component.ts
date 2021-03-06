import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPreferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';

@Component({
    selector: 'jhi-preferences-delete-dialog',
    templateUrl: './preferences-delete-dialog.component.html'
})
export class PreferencesDeleteDialogComponent {
    preferences: IPreferences;

    constructor(
        protected preferencesService: PreferencesService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.preferencesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'preferencesListModification',
                content: 'Deleted an preferences'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-preferences-delete-popup',
    template: ''
})
export class PreferencesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ preferences }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PreferencesDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.preferences = preferences;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/preferences', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/preferences', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
