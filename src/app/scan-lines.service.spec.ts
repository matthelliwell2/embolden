import {inject, TestBed} from '@angular/core/testing'
import {Line, ScanLinesService} from './scan-lines.service'

fdescribe('ScanLinesService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ScanLinesService]
        })
    })

    it('should be created', inject([ScanLinesService], (service: ScanLinesService) => {
        expect(service).toBeTruthy()
    }))

    it('should create scanlines for a square', inject([ScanLinesService], (service: ScanLinesService) => {
        const elementMock = jasmine.createSpyObj('element', {
            'getBBox': {x:0, y: 0, width: 10, height: 10},
            'attr': 'M0,0 L10,0 L10,10, L0,10    Z'
        })

        const result = service.generateScanLines({x: 0, y:0}, 1, elementMock)

        expect(result.length).toEqual(11)

        expect(result).toEqual([
            [{start: {x:-0, y:-0}, end: {x:10, y:-0}}],
            [{start: {x:-0, y:1}, end: {x:10, y:1}}],
            [{start: {x:-0, y:2}, end: {x:10, y:2}}],
            [{start: {x:-0, y:3}, end: {x:10, y:3}}],
            [{start: {x:-0, y:4}, end: {x:10, y:4}}],
            [{start: {x:-0, y:5}, end: {x:10, y:5}}],
            [{start: {x:-0, y:6}, end: {x:10, y:6}}],
            [{start: {x:-0, y:7}, end: {x:10, y:7}}],
            [{start: {x:-0, y:8}, end: {x:10, y:8}}],
            [{start: {x:-0, y:9}, end: {x:10, y:9}}],
            [{start: {x:-0, y:10}, end: {x:10, y:10}}]
        ])
    }))

    fit('should create scanlines for a concave polygon', inject([ScanLinesService], (service: ScanLinesService) => {
        const elementMock = jasmine.createSpyObj('element', {
            'getBBox': {x:0, y: 0, width: 80, height: 70},
            'attr': 'M0,0 L80,0 L80,70 L60,70 L60,30 L40,30 L40,51 L0,51 Z'
        })

        const result = service.generateScanLines({x: 0, y:0}, 10, elementMock)

        console.log('results', result.map(roundCoords))
        expect(result.length).toEqual(8)

        expect(result.map(roundCoords)).toEqual([
            [{start: {x:-0, y:0}, end: {x:80, y:0}}],
            [{start: {x:-0, y:10}, end: {x:80, y:10}}],
            [{start: {x:-0, y:20}, end: {x:80, y:20}}],
            [{start: {x:-0, y:30}, end: {x:80, y:30}}],
            [{start: {x:-0, y:40}, end: {x:40, y:40}}, {start: {x:60, y:40}, end: {x:80, y:40}}],
            [{start: {x:-0, y:50}, end: {x:40, y:50}}, {start: {x:60, y:50}, end: {x:80, y:50}}],
            [{start: {x:60, y:60}, end: {x:80, y:60}}],
            [{start: {x:60, y:70}, end: {x:80, y:70}}]
        ])
    }))

    const roundCoords = (lines: Line[]): Line[] => {
        return lines.map(roundLine)
    }

    // Rounds the coords of a line to nearest int to make equality comparison without rounding problems.
    const roundLine = (line: Line): Line => {
        line.start.x = Math.round(line.start.x)
        line.start.y = Math.round(line.start.y)

        line.end.x = Math.round(line.end.x)
        line.end.y = Math.round(line.end.y)

        return line
    }
})
