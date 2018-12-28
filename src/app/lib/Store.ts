import { BehaviorSubject, Observable, Subject } from "rxjs"
import { OnDestroy } from "@angular/core"

/**
 * Holds a value and publishes an event each time it is updated.
 */
export class Store<T> {
    stream: Observable<T>
    private source: BehaviorSubject<T>

    protected constructor(initialState: T) {
        this.source = new BehaviorSubject(initialState)
        this.stream = this.source.asObservable()
    }

    get state(): T {
        return this.source.getValue()
    }

    set state(nextState: T) {
        this.source.next(nextState)
    }
}

/**
 * Saves and loads value from local storage
 */
export class PersistingStore<T> extends Store<T> {
    private readonly name: string

    protected constructor(_name: string, initialState: T) {
        const values = localStorage.getItem(_name)
        if (values) {
            super(Object.assign(initialState, JSON.parse(values)))
        } else {
            super(initialState)
        }

        this.name = _name
    }

    set state(nextState: T) {
        localStorage.setItem(this.name, JSON.stringify(nextState))
        super.state = nextState
    }

    // We have to override even though it only calls the super class otherwise it doesn't get resolved properly at runtime for some reason
    get state(): T {
        return super.state
    }
}

/**
 * Publishes an event when component is destroyed so can unsubscribe, eg
 *             .pipe(takeUntil(this.destroyed))
 *             .subscribe(....)
 */
export class Destroyable implements OnDestroy {
    protected destroyed = new Subject()

    ngOnDestroy(): void {
        this.destroyed.next()
        this.destroyed.complete()
    }
}
