import { Injectable } from "@angular/core"

type TOPICS = "LoadFile" | "FileLoaded" | "ElementSelected" | "ElementDeselected" | "RenderSettingsChanged"

/**
 * Simple pu/sub service to isolate publishers and subscribers. This is similar to rxjs subscriber but I don't fancy using it for various reason.
 */
@Injectable({
    providedIn: "root"
})
export class PubSubService {
    private subscribers: any[] = []

    constructor() {}

    publish(topic: TOPICS, data?: any) {
        console.log("Event:", topic)
        this.subscribers
            .filter(subscriber => typeof subscriber[`on${topic}`] === "function")
            .forEach(subscriber => {
                subscriber[`on${topic}`](data)
            })
    }

    subscribe(subscriber: any) {
        this.subscribers.push(subscriber)
    }

    unsubscribe(subscriber: any) {
        this.subscribers = this.subscribers.filter(s => s != subscriber)
    }
}
