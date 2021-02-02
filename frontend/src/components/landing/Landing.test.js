import Landing from './Landing'
import React from "react"
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// test Landing page text and buttons, test that I can/Need Help link works.
describe('Landing component', () => {
    test(`
                      Given the required props, 
                      When the component is rendered, 
                      then the landing text should be present`, () => {
        const requiredProps = {
            complete: false,
            text: "Help Who Needs",
            id: "001",
            deleteTask: () => { }
        }

        render(<Landing {...requiredProps} />)
        expect(screen.getByText("Help Who Needs")).toBeInTheDocument()


    })

    // const wrapper = shallow(<ArchiveButton onClick={onClick} {...props}/>);

    //let button = wrapper.find('Button').prop('children');
    // expect(button[1]).toMatch(/\sUnarchive/);

    test(`
                      Given the required props, 
                      When the component is rendered, 
                      then the landing buttons should be present`, () => {
        const requiredProps = {
            complete: false,
            text: "Help Who Needs",
            id: "001",
            //  deleteTask: () => {}
        }

        render(<Landing {...requiredProps} />)
        expect(screen
            .getAllByRole("button")
            .filter(button => button.text.Content === "I Can Help").length)
            .toBe(2)
    })

    test(`
                      Given the required props, 
                      When the i can help button is clicked, 
                      then the volunteer page sign in or sign up should be present`, () => {

        const requiredProps = {
            complete: false,
            text: "I Can Help",
            id: "001",
            //deleteTask: () => {}
        }
        render(<Landing {...requiredProps} />)
        expect(document.querySelector(“h”).getAttribute(“href”)).toBe(http://localhost:3000/addTask)
                      })
})