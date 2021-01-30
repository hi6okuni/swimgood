import { useState } from 'react'
import { 
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  BeatLoader,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"
import { Search2Icon } from '@chakra-ui/icons'
import { Formik, Field, Form} from 'formik'

export default function Search (props) {

  const [ticker, setTicker] = useState("");

  const searchSymbol = async (e) => {
    console.log(e);
    props.getSymbol(e);
  }

  const handleChange = (e) => {
    setTicker(e.target.value.toUpperCase())
  }

  return (
    <Box
      width="80%"
    >
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            searchSymbol(ticker)
            actions.setSubmitting(false)
          }, 1000)
        }}
      >
        {(props) => (
          <Form>
            <Flex
              align="center"
            >
              <Field name="name" >
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <InputGroup id="name">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                      />
                      <Input 
                        {...field} 
                        id="name" 
                        borderColor="transparent"
                        backgroundColor="gray.800"
                        color="white"
                        placeholder="ex.AAPL" 
                        focusBorderColor="#ffafbd"
                        onChange={handleChange}
                        value={ticker}
                        fontSize="sm"
                      />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                bg="#ffe1e7"
                _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )" }}
                color="#3f3356"
                isLoading={props.isSubmitting}
                type="submit"
                fontSize="xs"
              >
                Search
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

