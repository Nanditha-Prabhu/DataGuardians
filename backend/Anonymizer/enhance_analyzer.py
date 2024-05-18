from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_analyzer import Pattern, PatternRecognizer
from presidio_analyzer.nlp_engine import NlpEngineProvider




def getAnalyzer():
    ################################ NLP Engines ##################################
    # Can add other NER models too
    # src: https://microsoft.github.io/presidio/analyzer/customizing_nlp_models/
    nlp_configuration = {
        "nlp_engine_name": "spacy",
        "models": [
            {
                "lang_code": "en",
                "model_name": "en_core_web_lg"
            }
        ]
    }
    nlp_engine = NlpEngineProvider(
        nlp_configuration=nlp_configuration
    ).create_engine()
    analyzer = AnalyzerEngine(
        nlp_engine=nlp_engine,
        supported_languages=["en"]
    )

    ################################## Deny List #################################
    # Recognize titles
    titles_list = [
        "Sir",
        "Ma'am",
        "Madam",
        "Mr.",
        "Mrs.",
        "Ms.",
        "Miss",
        "Dr.",
        "Professor",
    ]
    titles_recognizer = PatternRecognizer(
        supported_entity="TITLE",
        deny_list=titles_list
    )
    analyzer.registry.add_recognizer(titles_recognizer)


    ############################# Regular Expression #############################
    # Recognize Indian mobile numbers
    pattern = r"(\+91\d{10}|\+91 \d{10})"
    phone_no_pattern = Pattern(name="pat", regex=pattern, score=1.0)
    phone_no = PatternRecognizer(
        supported_entity="PHONE_NUMBER",
        patterns=[phone_no_pattern]
    )
    analyzer.registry.add_recognizer(phone_no)

    return analyzer

if __name__ == "__main__":
    text = "My name is Mr. Ariyal and my mobile number is +91 1234567890"
    analyzer = getAnalyzer()
    res = analyzer.analyze(
        text=text,
        language="en"
    )
    print(res)
    print(AnonymizerEngine().anonymize(text=text, analyzer_results=res))
    
