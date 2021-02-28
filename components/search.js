import { useState } from 'react'
import { 
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react"
import { Search2Icon, ArrowRightIcon } from '@chakra-ui/icons'
import { Formik, Field, Form} from 'formik'

export default function Search (props) {

  const [ticker, setTicker] = useState("");
  const [toggleFocus, setToggleFocus] = useState(false);


  const searchSymbol = async (e) => {
    console.log(e);
    props.getSymbol(e);
  }

  const handleChange = (e) => {
    setTicker(e.target.value.toUpperCase())
  }

  const handleFocus = () => {
    setToggleFocus(true)
  }

  const handleBlur = () => {
    setToggleFocus(false)
  }

  return (
    <Box
      width="85%"
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
              <Field name="name" >
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <InputGroup id="name" >
                      <Input 
                        {...field} 
                        id="name" 
                        px="30px"
                        backgroundColor="#e8f0fe"
                        placeholder="ex: TSLA " 
                        focusBorderColor="none"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={ticker}
                        fontSize="sm"
                        size="lg"
                        borderRadius="3xl"
                        border="1px solid black"
                      />
                      { toggleFocus || ticker !== "" ? 
                      <InputRightElement>
                      <Button
                        align="right"
                        bg="#fd867a"
                        isLoading={props.isSubmitting}
                        type="submit"
                        fontSize="xs"
                        mt="9px"
                        mr="9px"
                        borderRadius="50%"
                        size="sm"
                        _hover={{ bg: "#fd867a" }}
                        transition="all 400ms"
                      >
                        <Search2Icon color="white" />
                      </Button>
                    </InputRightElement>
                      : 
                      <InputRightElement width="5.5rem">    
                      <Button
                        bg="#fd867a"
                        isLoading={props.isSubmitting}
                        type="submit"
                        color="white"
                        fontSize="9px"
                        mt="9px"
                        mr="9px"
                        borderRadius="3xl"
                        size="sm"
                        _hover={{ bg: "#fd867a" }}
                        transition="all 400ms"
                      >
                        ティッカーを入力
                      </Button>
                    </InputRightElement>
                      }                      
                    </InputGroup>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

