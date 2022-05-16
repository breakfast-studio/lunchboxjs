declare module 'cypress-image-snapshot/command' {
    type SnapshotOptions = Partial<
        Cypress.Loggable &
            Cypress.Timeoutable &
            Cypress.ScreenshotOptions &
            import('jest-image-snapshot').MatchImageSnapshotOptions
    >

    export const addMatchImageSnapshotCommand: (
        options?: SnapshotOptions
    ) => void
}
